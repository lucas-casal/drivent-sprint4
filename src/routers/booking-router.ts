import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { createBooking, editBooking, getBooking } from '@/controllers';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken)
bookingRouter.post('/', createBooking)
bookingRouter.get('/', getBooking)
bookingRouter.put('/:bookingId', editBooking)



export { bookingRouter };
