import dedent from 'dedent-js'
import P from '../Components/P'
import H1 from '../Components/H1'
import H2 from '../Components/H2'
import Layout from '../Components/Layout'
import InlineCode from '../Components/InlineCode'
import TabbedCode from '../Components/TabbedCode'

const meta = {
  title: 'Redirects',
  links: [
    { url: '#top', name: 'Making redirects' },
    { url: '#303-response-code', name: '303 response code' },
    { url: '#external-redirects', name: 'External redirects' },
  ],
}

const Page = () => {
  return (
    <>
      <H1>Redirects</H1>
      <P>
        When making a non-GET Inertia request, via <InlineCode>{`<inertia-link>`}</InlineCode> or manually, be sure to
        always respond with a proper Inertia response.
      </P>
      <P>
        For example, if you're creating a new user, have your "store" endpoint return a redirect back to a standard GET
        endpoint, such as your user index page.
      </P>
      <P>
        Inertia will automatically follow this redirect and update the page accordingly. Here's a simplified example.
      </P>
      <TabbedCode
        examples={[
          {
            name: 'Laravel',
            language: 'php',
            code: dedent`
              class UsersController extends Controller
              {
                  public function index()
                  {
                      return Inertia::render('Users/Index', [
                          'users' => User::all(),
                      ]);
                  }\n
                  public function store()
                  {
                      User::create(
                          Request::validate([
                              'name' => ['required', 'max:50'],
                              'email' => ['required', 'max:50', 'email'],
                          ])
                      );\n
                      return Redirect::route('users.index');
                  }
              }
            `,
          },
          {
            name: 'Rails',
            language: 'ruby',
            code: dedent`
              class UsersController < ApplicationController
                def index
                  render inertia: 'Users/Index', props: {users: User.all}
                end\n
                def create
                  User.create params.require(:user).permit(:name, :email)\n
                  redirect_to users_path
                end
              end
            `,
          },
        ]}
      />
      <H2>303 response code</H2>
      <P>
        Note, when redirecting after a <InlineCode>PUT</InlineCode>, <InlineCode>PATCH</InlineCode> or{' '}
        <InlineCode>DELETE</InlineCode> request you must use a <InlineCode>303</InlineCode> response code, otherwise the
        subsequent request will not be treated as a <InlineCode>GET</InlineCode> request. A <InlineCode>303</InlineCode>{' '}
        redirect is the same as a <InlineCode>302</InlineCode> except that the follow-up request is explicitly changed
        to a <InlineCode>GET</InlineCode> request.
      </P>
      <P>If you're using one of our official server-side adapters, redirects will automatically be converted.</P>
      <H2>External redirects</H2>
      <P>
        Sometimes it's necessary to redirect to an external website, or even another non-Inertia endpoint in your app,
        within an Inertia request. This is possible using a server-side initiated{' '}
        <InlineCode>window.location</InlineCode> visit.
      </P>
      <TabbedCode
        examples={[
          {
            name: 'Laravel',
            language: 'php',
            code: dedent`
              return Inertia::location($url);
            `,
          },
          {
            name: 'Rails',
            language: 'ruby',
            code: dedent`
              inertia_location index_path
            `,
          },
        ]}
      />
      <P>
        This will generate a <InlineCode>409 Conflict</InlineCode> response, which includes the destination URL in the{' '}
        <InlineCode>X-Inertia-Location</InlineCode> header. Client-side, Inertia will detect this response and
        automatically do a <InlineCode>window.location = url</InlineCode> visit.
      </P>
    </>
  )
}

Page.layout = (page) => <Layout children={page} meta={meta} />

export default Page
