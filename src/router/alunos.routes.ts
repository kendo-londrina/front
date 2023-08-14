import { Layout, List, AddEdit } from '@/views/alunos';

export default {
    path: '/alunos',
    component: Layout,
    children: [
        { path: '', component: List },
        { path: 'add', component: AddEdit },
        { path: 'edit/:id', component: AddEdit }
    ]
};
