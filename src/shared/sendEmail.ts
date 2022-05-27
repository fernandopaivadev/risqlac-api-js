import { readFileSync } from 'fs'
import { compile } from 'handlebars'
import { createTransport } from 'nodemailer'
import path from 'path'

import config from '@config'
import { log } from '@shared'
import { Shared } from '@types'

const sendEmail: Shared.SendEmail.SendEmailFunction = async ({
  from, to, subject, template, data, attachments
}) => {
  const templatePath = path.resolve(
    __dirname, '..', 'templates', `${template}.hbs`
  )
  const templateContent = readFileSync(templatePath, 'utf8').toString()

  const compiledTemplate = compile(templateContent)
  const result = compiledTemplate(data)

  const transporter = createTransport({
    secure: false,
    ...config.EMAIL_CONFIG
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
