import { readFileSync } from 'fs'
import { compile } from 'handlebars'
import { createTransport } from 'nodemailer'
import path from 'path'

import { Services } from '../@types'
import config from '../config'
import { log } from '../services'

const sendEmail: Services.SendEmail.SendEmailFunction = async ({
  from, to, subject, template, data, attachments
}) => {
  const templatePath = path.resolve(
    __dirname, '..', 'templates', `${template}.hbs`
  )
  const templateContent = readFileSync(templatePath, 'utf8').toString()

  const compiledTemplate = compile(templateContent)
  const result = compiledTemplate(data)

  const transporter = createTransport({
    host: config.EMAIL_CONFIG_HOST,
    port: config.EMAIL_CONFIG_PORT,
    auth: {
      user: config.EMAIL_CONFIG_AUTH_USER,
      pass: config.EMAIL_CONFIG_AUTH_PASS
    }
  })

  await transporter.sendMail({
    attachments,
    from,
    to,
    subject,
    text: result
  }).catch((err: Error) => {
    log.error('EMAIL_SHIPPING', err)
  })
}

export default sendEmail
