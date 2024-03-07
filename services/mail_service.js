const express = require("express");
const nodemailer = require("nodemailer");
const config = require("config");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: config.get("smtp_host"),
      port: config.get("smtp_port"),
      secure: false,
      auth: {
        user: config.get("smtp_user"),
        pass: config.get("smtp_pass"),
      },
    });
  }
  async sendActivationMail(toMail, link) {
    await this.transporter.sendMail({
      from: config.get("smtp_user"),
      to: toMail,
      subject: "Akkaountini faollashtirish",
      html: `<a href="${link}">Click here to activate your account</a>`,
    });
  }
}

module.exports = new MailService();
