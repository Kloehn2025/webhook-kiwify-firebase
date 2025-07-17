import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const app = initializeApp({
  credential: applicationDefault(),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { email, first_name, last_name } = req.body;

    if (!email || !first_name || !last_name) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const randomPassword = Math.random().toString(36).slice(-10);

    await getAuth(app).createUser({
      email,
      password: randomPassword,
      displayName: `${first_name} ${last_name}`,
    });

    const link = await getAuth(app).generatePasswordResetLink(email);

    console.log(`Usuário criado: ${email}`);
    console.log(`Link de redefinição: ${link}`);

    return res.status(200).json({ message: 'Usuário criado com sucesso!', resetLink: link });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao criar usuário' });
  }
}
