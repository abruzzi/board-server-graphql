import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const existing = await prisma.user.findUnique({
        where: { email: 'juntao.qiu@gmail.com' },
    });

    if (!existing) {
        await prisma.user.create({
            data: {
                id: "user-local",
                name: "Juntao Qiu",
                email: "juntao.qiu@gmail.com"
            },
        });
        console.log('✅ Dev user created');
    } else {
        console.log('ℹ️ Dev user already exists');
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });