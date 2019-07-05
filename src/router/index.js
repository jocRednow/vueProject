import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Search from '@/components/searchPage/Search'
import BornForm from '@/components/BornForm'
import BornFormRead from '@/components/BornFormRead'
import DeathForm from '@/components/DeathForm'
import DeathFormRead from '@/components/DeathFormRead'
import PerinatalDeathForm from '@/components/PerinatalDeathForm'
import PerinatalDeathFormRead from '@/components/PerinatalDeathFormRead'
import AdminForm from '@/components/settings/AdminForm'
import UserForm from '@/components/settings/UserForm'
import PersonForm from '@/components/settings/PersonForm'
import DepartmentForm from '@/components/settings/DepartmentForm'
import PageNotFound from '@/components/PageNotFound'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: { name: 'Search' }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/bornForm',
      name: 'BornForm',
      component: BornForm
    },
    {
      path: '/bornForm/edit/:id',
      name: 'BornFormEdit',
      component: BornForm
    },
    {
      path: '/bornForm/read/:id',
      name: 'BornFormRead',
      component: BornFormRead
    },
    {
      path: '/deathForm',
      name: 'DeathForm',
      component: DeathForm
    },
    {
      path: '/deathForm/edit/:id',
      name: 'DeathFormEdit',
      component: DeathForm
    },
    {
      path: '/deathForm/read/:id',
      name: 'DeathFormRead',
      component: DeathFormRead
    },
    {
      path: '/perinatalDeathForm',
      name: 'PerinatalDeathForm',
      component: PerinatalDeathForm
    },
    {
      path: '/perinatalDeathForm/edit/:id',
      name: 'PerinatalDeathFormEdit',
      component: PerinatalDeathForm
    },
    {
      path: '/perinatalDeathForm/read/:id',
      name: 'PerinatalDeathFormRead',
      component: PerinatalDeathFormRead
    },
    {
      path: '/settings/admin',
      name: 'AdminForm',
      component: AdminForm
    },
    {
      path: '/settings/user',
      name: 'UserForm',
      component: UserForm
    },
    {
      path: '/settings/user/edit/:id',
      name: 'UserFormEdit',
      component: UserForm
    },
    {
      path: '/settings/person',
      name: 'PersonForm',
      component: PersonForm
    },
    {
      path: '/settings/person/edit/:id',
      name: 'PersonFormEdit',
      component: PersonForm
    },
    {
      path: '/settings/department',
      name: 'DepartmentForm',
      component: DepartmentForm
    },
    {
      path: '/settings/department/edit/:id',
      name: 'DepartmentFormEdit',
      component: DepartmentForm
    },
    {
      path: '*',
      name: 'pageNotFound',
      component: PageNotFound
    }
  ]
})
