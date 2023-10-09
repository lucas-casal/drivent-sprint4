import { forbiddenError, notFoundError } from "@/errors";
import { enrollmentRepository, hotelRepository, ticketsRepository, userRepository } from "@/repositories"
import { bookingRepository } from "@/repositories/booking-repository";

export async function create (userId: number, roomId: number){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    const room = await hotelRepository.findRoomByRoomId(roomId)
    const guestsNumber = await bookingRepository.findGuestsByRoomId(roomId)
    if (!room) throw notFoundError()
    if (ticket.status === 'RESERVED') throw forbiddenError('PAGO')
    if (ticket.TicketType.isRemote) throw  forbiddenError('REMOTO')
    if (!ticket.TicketType.includesHotel) throw  forbiddenError('HOSPEDAGEM')
    if (guestsNumber >= room.capacity) throw forbiddenError('VAGA')

    const result = await bookingRepository.create(userId, roomId)
    
    const resposta = {bookingId: result.id}
    
    return resposta
}

export async function get (userId: number) {
    const result = await bookingRepository.findBookingByUserId(userId)
    if(!result) throw notFoundError()
    
    delete result.createdAt
    delete result.updatedAt
    delete result.roomId
    delete result.userId


    
    return result
}

export async function put (bookingId: number, roomId: number){
    const room = await hotelRepository.findRoomByRoomId(roomId);
    if (!room) throw notFoundError()

    const booking = await bookingRepository.findBookingById(bookingId)
    if (!booking) throw forbiddenError('RESERVA')
    if (booking.roomId === roomId) throw forbiddenError('default')

    const guestsNumber = await bookingRepository.findGuestsByRoomId(roomId)
    if (guestsNumber >= room.capacity) throw forbiddenError('VAGA')

    const result = await bookingRepository.updateBooking(bookingId, roomId)
    if (!result) throw forbiddenError('default')

    const resposta = {bookingId: result.id}
    return resposta

}

export const bookingServices = {
    create,
    get,
    put
}