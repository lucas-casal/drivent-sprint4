import app, { init } from "@/app"
import supertest from "supertest"
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import { createHotel, createRoomWithHotelId } from "../factories/hotels-factory";
import { createBooking } from "../factories/booking-factory";
const server = supertest(app);
beforeAll(async () => {
    await init();
    await cleanDb();
  });
describe('pegando uma reserva', () => {
    describe('pegando uma reserva errado', ()=> {
        it('ele deve retornar 401 sem usuário autenticado', async () => {
            const book = await server.get('/booking').set('Authorization', 'Bearer Bruno')

            expect(book.status).toBe(401)

        })
        it('ele deve retornar 404 se não tem reserva', async () => {
            const user = await createUser()
            const tokenValido = await generateValidToken(user)

            
            const book = await server.get('/booking').set('Authorization', `Bearer ${tokenValido}`)

            expect(book.status).toBe(404)

        })
    })
    describe('pegando uma reserva certo', () => {
        it('ele deve retornar 200 se tem reserva e é autorizado', async () => {
            const user = await createUser()
            const tokenValido = await generateValidToken(user)
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id)
            const booking = await createBooking(user.id, room.id)

            
            const result = await server.get('/booking').set('Authorization', `Bearer ${tokenValido}`)

            expect(result.status).toBe(200)
            expect(result.body).toEqual(expect.objectContaining({
                id: expect.any(Number),
                Room: expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    capacity: expect.any(Number),
                    hotelId: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                })

            }))

        })
    })
})

describe('criando uma reserva', () => {
    describe('criando uma reserva errado',()=>{
        it('ele deve retornar 401 se não tiver logado', async () => {
    
        const book = await server.post('/booking').set('Authorization', `Bearer `)

        expect(book.status).toBe(401)
        })

        it('ele deve retornar 404 se não tiver room', async () => {
            const user = await createUser()
            const tokenValido = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(false, true)
            const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID')

            
            const book = await server.post('/booking').set('Authorization', `Bearer ${tokenValido}`).send({roomId: -1})

            expect(book.status).toBe(404)

        })

        it('ele deve retornar 403 se o quarto ta lotado', async () => {
            const user = await createUser()
            const tokenValido = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(false, true)
            const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID')
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id)
            const userA = await createUser()
            const userB = await createUser()
            const userC = await createUser()
            const bookingA = await createBooking(userA.id, room.id)
            const bookingB = await createBooking(userB.id, room.id)
            const bookingC = await createBooking(userC.id, room.id)

            
            const book = await server.post('/booking').set('Authorization', `Bearer ${tokenValido}`).send({roomId: room.id})

            expect(book.status).toBe(403)

        })

        it('ele deve retornar 403 se ingresso do tipo presencial, com hospedagem e ingresso não-pago', async () => {
            const user = await createUser()
            const tokenValido = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(false, true)
            const ticket = await createTicket(enrollment.id, ticketType.id, 'RESERVED')
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id)

            
            const book = await server.post('/booking').set('Authorization', `Bearer ${tokenValido}`).send({roomId: room.id})

            expect(book.status).toBe(403)

        })

        it('ele deve retornar 403 se ingresso do tipo presencial, sem hospedagem e ingresso pago', async () => {
            const user = await createUser()
            const tokenValido = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(false, false)
            const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID')
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id)

            
            const book = await server.post('/booking').set('Authorization', `Bearer ${tokenValido}`).send({roomId: room.id})

            expect(book.status).toBe(403)

        })

        it('ele deve retornar 403 se ingresso do tipo não-presencial, com hospedagem e ingresso pago', async () => {
            const user = await createUser()
            const tokenValido = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(true, true)
            const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID')
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id)

            
            const book = await server.post('/booking').set('Authorization', `Bearer ${tokenValido}`).send({roomId: room.id})

            expect(book.status).toBe(403)

        })
    
    })
    
    describe('criando uma reserva certo', () => {
        it('ele deve retornar 200 se é autorizado, ingresso do tipo presencial, com hospedagem e ingresso pago', async () => {
            const user = await createUser()
            const tokenValido = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(false, true)
            const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID')
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id)

            
            const result = await server.post('/booking').set('Authorization', `Bearer ${tokenValido}`).send({roomId: room.id})

            expect(result.status).toBe(200)
            expect(result.body).toEqual(expect.objectContaining({bookingId: expect.any(Number)}))

        })
    })
})

describe('trocando uma reserva', () => {
    describe('trocando uma reserva errado', () => {
        it('ele deve retornar 401 sem usuário autenticado', async () => {
            const hotel = await createHotel();
            const roomA = await createRoomWithHotelId(hotel.id)
            const roomB = await createRoomWithHotelId(hotel.id)

            const result = await server.put(`/booking/${roomA.id}`).set('Authorization', 'Bearer Bruno').send({roomId: roomB.id})

            expect(result.status).toBe(401)

        })
        
        it('ele deve retornar 404 se o quarto não existe', async () => {
            const user = await createUser()
            const tokenValido = await generateValidToken(user)
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id)
            const booking = await createBooking(user.id, room.id)
            
            const result = await server.put(`/booking/${room.id}`).set('Authorization', `Bearer ${tokenValido}`).send({roomId: -1})
    
            expect(result.status).toBe(404)
    
        })

        it('ele deve retornar 403 se não possui uma reserva', async () => {
            const user = await createUser()
            const tokenValido = await generateValidToken(user)
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id)
    
            
            const result = await server.put(`/booking/${-1}`).set('Authorization', `Bearer ${tokenValido}`).send({roomId: room.id})
    
            expect(result.status).toBe(403)
    
        })

        it('ele deve retornar 403 se o novo quarto tá lotado', async () => {
            const user = await createUser()
            const tokenValido = await generateValidToken(user)
            const hotel = await createHotel();
            const roomA = await createRoomWithHotelId(hotel.id)
            const roomB = await createRoomWithHotelId(hotel.id)
            const booking = await createBooking(user.id, roomA.id)

            const userA = await createUser()
            const userB = await createUser()
            const userC = await createUser()
            const bookingA = await createBooking(userA.id, roomB.id)
            const bookingB = await createBooking(userB.id, roomB.id)
            const bookingC = await createBooking(userC.id, roomB.id)
    
            
            const result = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${tokenValido}`).send({roomId: roomB.id})
    
            expect(result.status).toBe(403)
    
        })
    })

    describe('trocando uma reserva certo', () => {
        it('ele deve retornar 200 com bookingId', async() => {
            const user = await createUser()
            const tokenValido = await generateValidToken(user)
            const hotel = await createHotel();
            const roomA = await createRoomWithHotelId(hotel.id)
            const roomB = await createRoomWithHotelId(hotel.id)
            const booking = await createBooking(user.id, roomA.id)


            
            const result = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${tokenValido}`).send({roomId: roomB.id})

            expect(result.status).toBe(200)
            expect(result.body).toEqual(expect.objectContaining({bookingId: expect.any(Number)}))

        })
    })
})

