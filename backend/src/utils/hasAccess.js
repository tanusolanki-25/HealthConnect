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

export async function getUserWithOauthId({ email, provider }) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      isValidEmail: true,
      oauthAccount: {
        select: {
          providerAccountId: true,
          provider: true
        }
      }
    }
  })

  if (!user || !user.oauthAccount || user.oauthAccount.provider !== provider ||  user.oauthAccount.userId !== user.id) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    providerAccountId: user.oauthAccount.providerAccountId,
    provider: user.oauthAccount.provider
  }
}

export async function linkUserWithOauth(userId, provider, providerAccountId) {
  await prisma.oauthAccount.create({
    data:{
      userId,
      provider,
      providerAccountId
    }
  })
}

export async function createUserWithOauth({ email, provider, providerAccountId }) {
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
        passwordHash: null,   // OAuth user ka password nahi hota
        isValidEmail: true
      }
    })

    // Step 2: usi transaction ke andar, OauthAccount bhi banao
    await tx.oauthAccount.create({
      data: {
        userId: newUser.id,
        provider,
        providerAccountId
      }
    })

  return {
    id: newUser.id,
    email,
    isValidEmail: true,
    provider,
    providerAccountId 
  }
})

  return user
}
