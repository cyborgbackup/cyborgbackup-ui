import {NbMenuItem} from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Dashboard',
        icon: 'home-outline',
        link: '/dashboard',
        home: true,
    },
    {
        title: 'Jobs',
        icon: 'settings-outline',
        link: '/job',
    },
    {
        title: 'Catalog',
        icon: 'book-outline',
        link: '/catalog',
    },
    {
        title: 'Client',
        icon: 'monitor-outline',
        children: [
            {title: 'List Client', link: '/client'},
            {title: 'Add Client', link: '/client/add'},
        ],
    },
    {
        title: 'Policy',
        icon: 'file-outline',
        children: [
            {title: 'List Policy', link: '/policy'},
            {title: 'Add Policy', link: '/policy/add'},
        ],
    },
    {
        title: 'Repository',
        icon: 'cube-outline',
        children: [
            {title: 'List Repository', link: '/repository'},
            {title: 'Add Repository', link: '/repository/add'},
        ],
    },
    {
        title: 'Schedule',
        icon: 'clock-outline',
        children: [
            {title: 'List Schedule', link: '/schedule'},
            {title: 'Add Schedule', link: '/schedule/add'},
        ],
    },
    {
        title: 'User',
        icon: 'person-outline',
        children: [
            {title: 'List User', link: '/user'},
            {title: 'Add User', link: '/user/add'},
        ],
    },
    {
        title: 'Settings',
        icon: 'keypad-outline',
        link: '/settings',
    },
];
