type QueuedRequest<T> = () => Promise<T>;

class RequestQueue {
  private queue: QueuedRequest<any>[] = [];
  private processing = false;

  async enqueue<T>(request: QueuedRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error('[RequestQueue] Error processing request:', error);
        }
      }
    }
    
    this.processing = false;
  }
}

export const requestQueue = new RequestQueue();