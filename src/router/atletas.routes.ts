import { Layout, List, AddEdit } from '@/views/atletas';

export default {
    path: '/atletas',
    component: Layout,
    children: [
        { path: '', component: List },
        { path: 'add', component: AddEdit },
        { path: 'edit/:id', component: AddEdit }
    ]
};
