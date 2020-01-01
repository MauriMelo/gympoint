import BeeQueue from 'bee-queue';
import EnrollmentMail from '../app/jobs/EnrollmentMail';
import OrderAnswerMail from '../app/jobs/OrderAnswerMail';
import redisConfig from '../config/redis';

const jobs = [EnrollmentMail, OrderAnswerMail];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new BeeQueue(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleError).process(handle);
    });
  }

  handleError(job, err) {
    console.log(`Queue ${job.queue.name} FAILED`, err);
  }

  destroy() {
    Promise.all(
      jobs.map(async ({ key }) => {
        const destroy = await this.queues[key].bee.close();
        return destroy;
      })
    );
  }
}

export default new Queue();
