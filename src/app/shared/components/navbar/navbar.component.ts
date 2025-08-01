import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { routes } from '@app/app.routes';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  router = inject(Router);
  routes = routes
    .filter(({ title }) => !!title)
    .map(({ path, title }) => ({ path, title: `${title}` }));

  pageTitle = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.url),
      map(
        (uri) =>
          routes.find((route) => `/${route.path}` === uri)?.title ??
          'Angular Maps'
      )
    )
  );
}
