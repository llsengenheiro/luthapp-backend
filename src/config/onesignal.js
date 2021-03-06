import https from 'https';

class OneSignal {
  sendNotification(data) {
    try {
      console.log(data);
      const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: 'Basic NTE0MTFjOTYtNGFhYS00ZWVmLTk0MTItOGI1NzE4NDU4ZWYw',
      };

      const options = {
        host: 'onesignal.com',
        port: 443,
        path: '/api/v1/notifications',
        method: 'POST',
        headers,
      };

      const req = https.request(options, res => {
        res.on('data', item => {
          console.log('Response:');
          console.log(JSON.parse(item));
        });
      });

      req.on('error', e => {
        console.log('ERROR:');
        console.log(e);
      });

      req.write(JSON.stringify(data));
      req.end();
    } catch (error) {
      console.log(error);
    }
  }
}

export default new OneSignal();
