import Mail from '../../lib/Mail';

class OrderAnswerMail {
  get key() {
    return 'orderanswer';
  }

  async handle({ data }) {
    await Mail.sendMail({
      to: data.to,
      subject: data.subject,
      template: 'orderanswer',
      context: {
        question: data.question,
        answer: data.answer,
        answer_at: data.answer_at,
      },
    });
  }
}

export default new OrderAnswerMail();
