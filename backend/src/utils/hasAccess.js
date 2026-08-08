import prisma from "../lib/prisma.js";

export const hasAccess = async (doctorId, patientId) => {
  const permission = await prisma.accessPermission.findFirst({
    where: {
      doctorId,
      patientId,
      status: "approved",
      expiryDate: { gte: new Date() }
    }
  })
  return !!permission
}