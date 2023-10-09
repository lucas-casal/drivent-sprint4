import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

async function findRoomByRoomId(roomId: number){
  return await prisma.room.findFirst({
    where: {id: roomId}
  })
}

export const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
  findRoomByRoomId
};
