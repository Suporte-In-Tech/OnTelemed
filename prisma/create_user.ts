import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.USER_EMAIL || 'admin@telemedicina.com'
  const senha = process.env.USER_PASSWORD || 'Telemed@2026'
  const tipo = (process.env.USER_ROLE || 'medico') as 'admin' | 'paciente' | 'medico'
  
  const senha_hash = await bcrypt.hash(senha, 12)

  console.log(`Configurando usuário: ${email} com tipo: ${tipo}...`)

  const user = await prisma.usuario.upsert({
    where: { email },
    update: {
      senha_hash,
      tipo_usuario: tipo,
      registroFull: true
    },
    create: {
      email,
      senha_hash,
      tipo_usuario: tipo,
      registroFull: true
    }
  })

  if (tipo === 'medico') {
    await prisma.medico.upsert({
      where: { usuario_id: user.id },
      update: {
        nome_completo: 'Dr. José Rodrigues',
        verificacao: 'verificado',
        crm: '123456',
        crm_uf: 'SP',
        especialidade: 'Clínica Geral'
      },
      create: {
        usuario_id: user.id,
        nome_completo: 'Dr. José Rodrigues',
        cpf: '78912345600',
        crm: '123456',
        crm_uf: 'SP',
        telefone_celular: '11999999999',
        especialidade: 'Clínica Geral',
        data_nascimento: new Date('1990-01-01'),
        verificacao: 'verificado'
      }
    })
  } else if (tipo === 'paciente') {
    await prisma.paciente.upsert({
      where: { usuario_id: user.id },
      update: {
        nome_completo: 'José Rodrigues',
      },
      create: {
        usuario_id: user.id,
        nome_completo: 'José Rodrigues',
        cpf: '78912345600',
        data_nascimento: new Date('1995-01-01'),
        sexo: 'Masculino',
        estado_civil: 'Solteiro',
        telefone: '11999999999',
        aceitouTCLE: true,
        tcleData: new Date()
      }
    })
  }

  console.log(`✅ Usuário ${email} criado/atualizado com sucesso! ID: ${user.id}, Role: ${tipo}`)
}

main()
  .catch((e) => {
    console.error('Erro ao criar usuário:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
