const shellRoute = {
  path: "shell",
  name: "shellIndex",
  redirect: { name: "shellNew" },
  component: () => import("pages/Shell.vue"),
  children: [
    {
      path: "new",
      props: true,
      name: "shellNew",
      component: () => import("components/Shell/CreatePage.vue")
    },
    {
      path: ":id",
      props: true,
      name: "shellId",
      component: () => import("components/Shell/ContainerShell.vue")
    }
  ]
};

const traefikRoute = {
  path: "traefik",
  name: "traefikIndex",
  redirect: "/traefik/overview",
  component: () => import("pages/Traefik.vue"),
  children: [
    {
      path: "overview",
      name: "traefikOverview",
      component: () => import("components/Traefik/Overview.vue")
    },
    {
      path: "entrypoints",
      name: "traefikEntrypoints",
      component: () => import("components/Traefik/Entrypoint/Table.vue")
    },
    {
      path: "routers",
      name: "traefikRouters",
      component: () => import("components/Traefik/Router/Table.vue")
    },
    {
      path: "middlewares",
      name: "traefikMiddlewares",
      component: () => import("components/Traefik/Middleware/Table.vue")
    },
    {
      path: "services",
      name: "traefikServices",
      component: () => import("components/Traefik/Service/Table.vue")
    },
    {
      path: "logs",
      name: "traefikLogs",
      component: () => import("components/Traefik/Log/Table.vue")
    }
  ]
};

const dnsRoute = {
  path: "dns",
  name: "dnsIndex",
  redirect: "/dns/overview",
  component: () => import("pages/DNS.vue"),
  children: [
    {
      path: "overview",
      name: "dnsOverview",
      component: () => import("components/DNS/Overview.vue")
    },
    {
      path: "zones",
      name: "dnsZones",
      component: () => import("components/DNS/Zone/Table.vue")
    },
    {
      path: "rules",
      name: "dnsRules",
      component: () => import("components/DNS/Rule/Table.vue")
    },
    {
      path: "logs",
      name: "dnsLogs",
      component: () => import("components/DNS/Log/Table.vue")
    }
  ]
};

const dockerRoute = {
  path: "docker",
  name: "dockerIndex",
  redirect: "/docker/overview",
  component: () => import("pages/Docker.vue"),
  children: [
    {
      path: "overview",
      name: "dockerOverview",
      component: () => import("components/Docker/Overview.vue")
    },
    {
      path: "images",
      name: "dockerImages",
      component: () => import("components/Docker/Image/Table.vue")
    },
    {
      path: "containers",
      name: "dockerContainers",
      component: () => import("components/Docker/Container/Table.vue")
    },
    {
      path: "networks",
      name: "dockerNetworks",
      component: () => import("components/Docker/Network/Table.vue")
    },
    {
      path: "volumes",
      name: "dockerVolumes",
      component: () => import("components/Docker/Volume/Table.vue")
    },
    {
      path: "logs",
      name: "dockerLogs",
      component: () => import("components/Docker/Log/Table.vue")
    }
  ]
};

const configRoute = {
  path: "config",
  name: "configIndex",
  redirect: { name: "configPassword" },
  component: () => import("src/pages/Auth.vue"),
  children: [
    {
      path: "password",
      name: "configPassword",
      component: () => import("components/Auth/Password.vue")
    },
    {
      path: "2fa",
      name: "config2fa",
      component: () => import("components/Auth/2FA.vue")
    },
    {
      path: "totp",
      name: "configTotp",
      redirect: { name: "config2fa" }
    }
  ]
};

const routes = [
  {
    path: "/",
    name: "index",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "login",
        name: "login",
        meta: {
          hideMenu: true,
          public: true,
        },
        component: () => import("pages/Login.vue")
      },
      {
        path: "install",
        name: "firstRun",
        meta: {
          hideMenu: true,
          public: true,
        },
        component: () => import("pages/FirstRun.vue")
      },
      configRoute,
      dockerRoute,
      dnsRoute,
      traefikRoute,
      shellRoute
    ]
  },
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
