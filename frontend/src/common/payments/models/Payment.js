import { Record } from 'immutable';

const Payment = Record({
  id: null,
  userId: null,
  amount: null,
  transactionType: '',
  variableSymbol: '',
  specificSymbol: '',
  constantSymbol: '',
  message: '',
  createdAt: null,
});

export default Payment;
