import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
async function create(userId: number, roomId: number){
    return await prisma.booking.create({
        data:{
            userId,
            roomId
        }
    })
}

async function findGuestsByRoomId(roomId: number){
    return await prisma.booking.count({
        where:{
            roomId
        }
    })
}

async function findBookingByUserId(userId: number){
    return await prisma.booking.findFirst({
        where: {userId},
        include: {
            Room: true
        }
    })
}
async function findBookingById(id: number){
    return await prisma.booking.findFirst({
        where: {id},
        include: {
            Room: true
        }
    })
}

async function updateBooking(id: number, roomId: number){
    return await prisma.booking.update({
        data: {
            roomId
        },
        where: {id}
    })
}

export const bookingRepository = {
    create,
    findGuestsByRoomId,
    findBookingByUserId,
    findBookingById,
    updateBooking
}