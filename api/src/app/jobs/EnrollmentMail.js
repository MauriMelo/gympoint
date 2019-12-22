import Mail from '../../lib/Mail';

class EnrollMentMail {
  get key() {
    return 'enrollment';
  }

  async handle({ data }) {
    const res = await Mail.sendMail({
      to: data.to,
      subject: data.subject,
      template: 'enrollment',
      context: {
        plan: data.plan,
        start_date: data.start_date,
        end_date: data.end_date,
        price: data.price,
      },
    });

  }
}

export default new EnrollMentMail();
