import { Layout, List, AddEdit } from '@/views/familias';

export default {
    path: '/familias',
    component: Layout,
    children: [
        { path: '', component: List },
        { path: 'add', component: AddEdit },
        { path: 'edit/:id', component: AddEdit }
    ]
};
