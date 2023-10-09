import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingServices } from '@/services';

type BodyBook = {
  roomId: number
}
export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { roomId } = req.body as BodyBook;
  const { userId } = req;

  const result = await bookingServices.create(userId, roomId);

  return res.status(httpStatus.OK).send(result);
}
export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const result = await bookingServices.get(userId);

  return res.status(httpStatus.OK).send(result);
}

export async function editBooking(req: AuthenticatedRequest, res: Response) {
  const {bookingId} = req.params;
  const {roomId} = req.body;

  const result = await bookingServices.put(Number(bookingId), roomId);

  return res.status(httpStatus.OK).send(result);
}
