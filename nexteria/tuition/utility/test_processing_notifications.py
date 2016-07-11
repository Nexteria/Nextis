#!/usr/bin/env python3

# Lucia Pal, 2015

'''
Unit tests for parsing Tatra Banka bank statements emails.
'''

import unittest

from . import processing_notifications


class Test_processing_notifications(unittest.TestCase):

	def test_empty_email(self):
		transaction = processing_notifications.parse_email('')
		self.assertEqual('', transaction['account_number'])
		self.assertEqual(0, transaction['amount'])
		self.assertEqual('', transaction['description'])
		self.assertEqual('', transaction['vs'])
		self.assertEqual('', transaction['ss'])
		self.assertEqual('', transaction['ks'])
		self.assertEqual('', transaction['message'])

	def test_simple(self):
		email = (' Vazeny klient,'
			+ '\n'
			+ '1.5.2015 11:04 bol zostatok Vasho uctu'
			+ 'SK0211000000002611208846 zvyseny o 47,32 EUR.\n'
			+ 'uctovny zostatok:      11 323,46 EUR\n'
			+ 'aktualny zostatok:      2 313,37 EUR\n'
			+ 'disponibilny zostatok: 23 165,15 EUR\n'
			+ '\n'
			+ 'Popis transakcie: CCINT 7500/000000-3611208847\n'
			+ 'Referencia platitela: /VS123456/SS554433/KS0308\n'
			+ 'Informacia pre prijemcu: Pokus platba\n'
			+ 'S pozdravom\n'
			+ '\n'
			+ 'TATRA BANKA, a.s.\n'
			+ '\n'
			+ 'http://www.tatrabanka.sk\n'
			+ '\n'
			+ 'Poznamka: Vase pripomienky alebo otazky tykajuce sa '
			+ 'tejto spravy alebo inej nasej sluzby nam poslite, '
			+ 'prosim, pouzitim kontaktneho formulara na nasej '
			+ 'Web stranke.\n'
			+ '\n'
			+ 'Odporucame Vam mazat si po precitani prichadzajuce '
			+ 'bmail notifikacie. Historiu uctu najdete v ucelenom '
			+ 'tvare v pohyboch cez internet banking a nemusite ju '
			+ 'pracne skladat zo starych bmailov.')

		transaction = processing_notifications.parse_email(email)
		self.assertEqual('SK0211000000002611208846',
				transaction['account_number'])
		self.assertEqual(4732, transaction['amount'])
		self.assertEqual('CCINT 7500/000000-3611208847',
				transaction['description'])
		self.assertEqual('123456', transaction['vs'])
		self.assertEqual('554433', transaction['ss'])
		self.assertEqual('0308', transaction['ks'])
		self.assertEqual('Pokus platba', transaction['message'])

	def test_account_number(self):
		email = ''' S>K02>>>
			11 00
			00 000E
			
			
			2	>>>	6	112>>08> 846
			
			'''
		transaction = processing_notifications.parse_email(email)
		self.assertEqual('SK02110000000E2611208846',
				transaction['account_number'])

	def test_amount(self):
		email = '''zvyseny>> o  4>>>7,>32 EUR'''
		transaction = processing_notifications.parse_email(email)
		self.assertEqual(4732, transaction['amount'])
		self.assertEqual("kredit", transaction['transaction_type'])
	
	def test_amount2(self):
		email = '''zniz>> eny>> o  4>>>7,>32 EUR'''
		transaction = processing_notifications.parse_email(email)
		self.assertEqual(4732, transaction['amount'])
		self.assertEqual("debet", transaction['transaction_type'])

	def test_amount3(self):
		email = '''ZNIZENY O 47 Eur'''
		transaction = processing_notifications.parse_email(email)
		self.assertEqual(4700, transaction['amount'])
		self.assertEqual("debet", transaction['transaction_type'])

	def test_amount4(self):
		email = '''zvyseNy o 47.0001 Eur'''
		transaction = processing_notifications.parse_email(email)
		self.assertEqual(4700, transaction['amount'])
		self.assertEqual("kredit", transaction['transaction_type'])

	def test_description(self):
		email = '''Popis transa>>> kcie: CCINT 7500/000000-3611208847'''
		transaction = processing_notifications.parse_email(email)
		self.assertEqual('CCINT 7500/000000-3611208847',
				transaction['description'])

	def test_symbols(self):
		email = '''Referencia
			plati>> tela: /VS123456/SS554433/KS0308 ahoj'''
		transaction = processing_notifications.parse_email(email)
		self.assertEqual('123456', transaction['vs'])
		self.assertEqual('554433', transaction['ss'])
		self.assertEqual('0308', transaction['ks'])

	def test_permuted_symbols(self):
		email = '''Referencia platitela: /SS123456/KS5433/VS047308'''
		transaction = processing_notifications.parse_email(email)
		self.assertEqual('047308', transaction['vs'])
		self.assertEqual('123456', transaction['ss'])
		self.assertEqual('5433', transaction['ks'])

	def test_missing_symbols(self):
		email = '''Referencia platitela: /SS123456/VS047308'''
		transaction = processing_notifications.parse_email(email)
		self.assertEqual('047308', transaction['vs'])
		self.assertEqual('123456', transaction['ss'])
		self.assertEqual('', transaction['ks'])

	def test_missing_symbols2(self):
		email = '''Referencia platitela: ahoj'''
		transaction = processing_notifications.parse_email(email)
		self.assertEqual('', transaction['vs'])
		self.assertEqual('', transaction['ss'])
		self.assertEqual('', transaction['ks'])

	def test_missing_symbols3(self):
		email = '''Referencia platitela: /KS/SS/VS'''
		transaction = processing_notifications.parse_email(email)
		self.assertEqual('', transaction['vs'])
		self.assertEqual('', transaction['ss'])
		self.assertEqual('', transaction['ks'])

	def test_lower_case_symbols(self):
		email = '''Referencia platitela: /ks123/SS/VS'''
		transaction = processing_notifications.parse_email(email)
		self.assertEqual('', transaction['vs'])
		self.assertEqual('', transaction['ss'])
		self.assertEqual('123', transaction['ks'])

	def test_message(self):
		email = '''			Informa>>> > > > 
			cia pre >>>>pri>
			jemcu: Pokus platba 
			'''
		transaction = processing_notifications.parse_email(email)
		self.assertEqual('Pokus platba', transaction['message'])


if __name__ == '__main__':
	unittest.main()
