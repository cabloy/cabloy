import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

interface SiteEntry {
  site: 'Web' | 'Admin' | 'CommerceWeb' | 'CommerceAdmin';
  href: string;
}

const siteEntries: SiteEntry[] = [
  { site: 'Web', href: 'http://localhost:7102/' },
  { site: 'Admin', href: 'http://localhost:7102/admin/' },
  { site: 'CommerceWeb', href: 'http://localhost:7102/commerce/' },
  { site: 'CommerceAdmin', href: 'http://localhost:7102/commerce-admin/' },
];

@Controller()
export class ControllerSiteEntryTables extends BeanControllerBase {
  protected render() {
    const locale = this.scope.locale;
    const siteLabels = {
      Web: locale.SiteWeb(),
      Admin: locale.SiteAdmin(),
      CommerceWeb: locale.SiteCommerceWeb(),
      CommerceAdmin: locale.SiteCommerceAdmin(),
    };
    const tables = [
      { title: locale.VonaIntegratedSsr(), entries: siteEntries },
      {
        title: locale.ZovaStandaloneSsr(),
        entries: siteEntries.map(entry => ({
          ...entry,
          href: entry.href.replace(':7102', ':9000'),
        })),
      },
    ];

    return (
      <div class="grid gap-6 lg:grid-cols-2">
        {tables.map(table => (
          <section class="card border border-base-300 bg-base-100 shadow-sm">
            <div class="card-body gap-4">
              <h2 class="card-title">{table.title}</h2>
              <div class="overflow-x-auto">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">{locale.SsrSite()}</th>
                      <th scope="col">{locale.Url()}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.entries.map(entry => (
                      <tr>
                        <td>{siteLabels[entry.site]}</td>
                        <td>
                          <a class="link link-primary break-all" href={entry.href} rel="noreferrer">
                            {entry.href}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ))}
      </div>
    );
  }
}
