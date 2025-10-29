module.exports = {
    apps: [
        {
            name: 'enout-api',
            cwd: '/root/enout-event-management-APP-/apps/api',
            script: '/root/.local/share/pnpm/pnpm',
            args: 'dev',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '500M',
            env: {
                NODE_ENV: 'development',
                PATH: '/root/.local/share/pnpm:/usr/local/bin:/usr/bin:/bin'
            },
            error_file: '/root/enout-event-management-APP-/logs/api-error.log',
            out_file: '/root/enout-event-management-APP-/logs/api-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            merge_logs: true
        },
        {
            name: 'enout-admin',
            cwd: '/root/enout-event-management-APP-/apps/admin',
            script: '/root/.local/share/pnpm/pnpm',
            args: 'dev',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '500M',
            env: {
                NODE_ENV: 'development',
                PATH: '/root/.local/share/pnpm:/usr/local/bin:/usr/bin:/bin'
            },
            error_file: '/root/enout-event-management-APP-/logs/admin-error.log',
            out_file: '/root/enout-event-management-APP-/logs/admin-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            merge_logs: true
        },
        {
            name: 'enout-mobile',
            cwd: '/root/enout-event-management-APP-/mobile',
            script: '/root/enout-event-management-APP-/start-mobile.sh',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '500M',
            env: {
                NODE_ENV: 'development',
                PATH: '/root/.local/share/pnpm:/usr/local/bin:/usr/bin:/bin'
            },
            error_file: '/root/enout-event-management-APP-/logs/mobile-error.log',
            out_file: '/root/enout-event-management-APP-/logs/mobile-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            merge_logs: true
        }
    ]
};
