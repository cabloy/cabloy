import { z } from 'zod';
import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';

export const ControllerPageRouteQueryBSchemaParams = z.object({});

export const ControllerPageRouteQueryBSchemaQuery = z.object({
  tabName: z.string().optional().default('boolean'),
  private: z.boolean().optional(),
  user: z
    .object({
      name: z.string(),
      age: z.number(),
    })
    .optional(),
  todos: z
    .array(
      z.object({
        title: z.string(),
        done: z.boolean(),
      }),
    )
    .optional(),
});

@Controller()
export class ControllerPageRouteQueryB extends BeanControllerPageBase {
  togglePrivate() {
    const _private = !this.$query.private;
    const query = { ...this.$query, private: _private };
    const url = this.$router.getPagePath('/demo/basic/routeQueryB', { query });
    this.$router.push(url);
  }

  toggleUser() {
    const user =
      this.$query.user?.name === 'tom' ? { name: 'kevin', age: 18 } : { name: 'tom', age: 6 };
    const query = { ...this.$query, user };
    const url = this.$router.getPagePath('/demo/basic/routeQueryB', { query });
    this.$router.push(url);
  }

  toggleTodos() {
    const todo =
      (this.$query.todos?.length ?? 0) % 2 === 0
        ? { title: 'Running', done: false }
        : { title: 'Eating', done: true };
    const todos = this.$query.todos ? [todo].concat(this.$query.todos) : [todo];
    const query = { ...this.$query, todos };
    const url = this.$router.getPagePath('/demo/basic/routeQueryB', { query });
    this.$router.push(url);
  }

  toggleTab(event, tabName: string) {
    const checked = event.target.checked;
    if (!checked) return;
    const query = { ...this.$query, tabName };
    const url = this.$router.getPagePath('/demo/basic/routeQueryB', { query });
    this.$router.push(url);
  }

  protected render() {
    return (
      <ZPage>
        <div role="tablist" class="tabs tabs-lifted">
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            class="tab"
            aria-label="boolean"
            checked={this.$query.tabName === 'boolean'}
            onChange={event => {
              this.toggleTab(event, 'boolean');
            }}
          />
          <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <div class="card bg-base-100 w-96 shadow-xl">
              <div class="card-body">
                <h2 class="card-title">$query.private</h2>
                <table class="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Value</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>$query.private</td>
                      <td>{this.$query.private?.toString()}</td>
                      <td>{typeof this.$query.private}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="card-actions justify-end">
                  <button
                    class="btn btn-primary"
                    onClick={() => {
                      this.togglePrivate();
                    }}
                  >
                    Go to current page with different private value
                  </button>
                </div>
              </div>
            </div>
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            class="tab"
            aria-label="json"
            checked={this.$query.tabName === 'json'}
            onChange={event => {
              this.toggleTab(event, 'json');
            }}
          />
          <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <div class="card bg-base-100 w-96 shadow-xl">
              <div class="card-body">
                <h2 class="card-title">$query.user</h2>
                <table class="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Value</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>$query.user?.name</td>
                      <td>{this.$query.user?.name}</td>
                      <td>{typeof this.$query.user?.name}</td>
                    </tr>
                    <tr>
                      <td>$query.user?.age</td>
                      <td>{this.$query.user?.age}</td>
                      <td>{typeof this.$query.user?.age}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="card-actions justify-end">
                  <button
                    class="btn btn-primary"
                    onClick={() => {
                      this.toggleUser();
                    }}
                  >
                    Go to current page with different user value
                  </button>
                </div>
              </div>
            </div>
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            class="tab"
            aria-label="array"
            checked={this.$query.tabName === 'array'}
            onChange={event => {
              this.toggleTab(event, 'array');
            }}
          />
          <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <div class="card bg-base-100 w-96 shadow-xl">
              <div class="card-body">
                <h2 class="card-title">$query.todos</h2>
                <table class="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Done</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.$query.todos?.map(item => {
                      return (
                        <tr>
                          <td>{item.title}</td>
                          <td>
                            <input
                              type="checkbox"
                              checked={item.done}
                              class="checkbox checkbox-success"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div class="card-actions justify-end">
                  <button
                    class="btn btn-primary"
                    onClick={() => {
                      this.toggleTodos();
                    }}
                  >
                    Go to current page with different todos value
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ZPage>
    );
  }
}
