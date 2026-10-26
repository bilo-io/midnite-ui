import { DiscordIcon, GithubIcon, GoogleIcon, LinearIcon, SlackIcon } from '@bilo-io/ui';

const icons = [
  { Icon: GithubIcon, name: 'GitHub' },
  { Icon: SlackIcon, name: 'Slack' },
  { Icon: DiscordIcon, name: 'Discord' },
  { Icon: GoogleIcon, name: 'Google' },
  { Icon: LinearIcon, name: 'Linear' },
];

export default function All() {
  return (
    <div className="flex flex-wrap gap-6">
      {icons.map(({ Icon, name }) => (
        <div key={name} className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
          <Icon className="h-8 w-8" aria-hidden />
          {name}
        </div>
      ))}
    </div>
  );
}
