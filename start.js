/* eslint-disable no-console */
const pm2 = require('pm2');

//specifies, in MB, the expected memory requirements of your application’s processes.
const maxMemory = process.env.WEB_MEMORY || 512;

//either connects to a running pm2 daemon (“God”) or launches and daemonizes one. Once launched, the pm2 process will keep running after the script exits.
pm2.connect(function() {
  let nodeArgs = '';

  if (maxMemory <= 512) {
    nodeArgs = '--max_semi_space_size=2 --max_old_space_size=512';
  } else if (maxMemory <= 768) {
    nodeArgs = '--max_semi_space_size=8 --max_old_space_size=768';
  } else if (maxMemory <= 1024) {
    nodeArgs = '--max_semi_space_size=16 --max_old_space_size=1024';
  }
  //Starts a script that will be managed by pm2.
  pm2.start(
    {
      script: 'app.js',
      name: 'holidayExtras',
      exec_mode: 'fork',
      instances: 1,
      max_memory_restart: maxMemory + 'M',
      node_args: nodeArgs
    },
    function() {
      // Display logs in standard output

      console.log('Holiday Extras homework ready');
      pm2.launchBus(function(err, bus) {
        console.log('[PM2] Log streaming started');

        bus.on('log:out', function(packet) {
          console.log('%s', packet.data);
        });

        bus.on('log:err', function(packet) {
          console.log('%s', packet.data);
        });
      });
    }
  );
});

/* eslint-disable no-console */
