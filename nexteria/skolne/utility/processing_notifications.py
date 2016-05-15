#!/usr/bin/env python3

# Lucia Pal, 2015

'''
Module for parsing Tatra Banka bank statements emails.
'''

import re

def parse_email(email):
	'''
	Converts an email message to a transaction.

	We ignore white spaces (including end of lines and tabs) and the '>'
	character except in the message fields themselves.
	'''

	def parse_account_number(email):
		'''
		Finds the account number in the email message.

		Current implementation works only for IBAN account numbers. See:
		https://en.wikipedia.org/wiki/International_Bank_Account_Number
		'''

		email = re.sub('[\s>]', '', email)
		m = re.search(r'[A-Z][A-Z][0-9A-Z]{0,30}', email)
		if (not m):
			return ''
		return  m.group(0)
	
	def parse_amount(email):
		'''
		Parses the transaction amount including the sign.

		Returns pair (transaction type, amount in eurocents)
		'''

		email = email.lower()
		email = re.sub('[\s>]', '', email)
		m = re.search(r'(zvyseny|znizeny)[a-zA-Z]*([0-9]+[,|.]?[0-9]*)'
				+ r'eur', email)
		if (not m): return ('', 0)
		amount = float(re.sub(',', '.', m.group(2)))
		amount = int(amount * 100)
		if (m.group(1) == 'znizeny'):
			return ("debet", amount)
		return ("kredit", amount)

	def parse_description(email):
		'''
		Parses transaction description.
		'''

		m = re.search(r'((?i)p[\s>]*o[\s>]*p[\s>]*i[\s>]*s[\s>]*t[\s>]*'
				+ r'r[\s>]*a[\s>]*n[\s>]*s[\s>]*a[\s>]*k[\s>]*'
				+ r'c[\s>]*i[\s>]*e[\s>]*:)([^\n]*)(\n|$)',
				email)
		if (not m): return ''
		return m.group(2).strip()
	
	def parse_symbols(email):
		'''
		Returns triple (variabilny symbol, specificky symbol,
		konstantny symbol).

		The function looks for strings of the form
		'Referencia platitela: /VS123456/SS554433/KS0308'.
		Case of the letters is irrelevant as well as order of symbols.
		'''

		email = re.sub('[>]', '', email)
		email = email.lower()
		m = re.search(r'r[\s]*e[\s]*f[\s]*e[\s]*r[\s]*e[\s]*n[\s]*'
				+ r'c[\s]*i[\s]*a[\s]*p[\s]*l[\s]*a[\s]*t[\s]*'
				+ r'i[\s]*t[\s]*e[\s]*l[\s]*a[\s]*:[\s]*([\S]*)'
				+ r'(\s|$)', email)
		if (not m):
			return ('', '', '')
		symbols = m.group(1)
		m2 = symbols.split('/')
		vs = ''
		ss = ''
		ks = ''
		for s in m2:
			if s[0:2] == 'vs':
				vs = s[2:]
			if s[0:2] == 'ss':
				ss = s[2:]
			if s[0:2] == 'ks':
				ks = s[2:]

		return  (vs, ss, ks)

	def parse_message(email):
		'''
		Parses payer's message.
		'''

		m = re.search(r'((?i)i[\s>]*n[\s>]*f[\s>]*o[\s>]*r[\s>]*m[\s>]*'
				+ r'a[\s>]*c[\s>]*i[\s>]*a[\s>]*p[\s>]*r[\s>]*'
				+ r'e[\s>]*p[\s>]*r[\s>]*i[\s>]*j[\s>]*e[\s>]*'
				+ r'm[\s>]*c[\s>]*u[\s>]*:)([^\n]*)(\n|$)',
				email)
		if (not m): return ''
		return m.group(2).strip()

	transaction = {}
	transaction['account_number'] = parse_account_number(email)
	(transaction['transaction_type'], transaction['amount']) = (
			 parse_amount(email))
	transaction['description'] = parse_description(email)
	(transaction['vs'], transaction['ss'], transaction['ks']) = (
			parse_symbols(email))
	transaction['message'] = parse_message(email)
	return transaction
