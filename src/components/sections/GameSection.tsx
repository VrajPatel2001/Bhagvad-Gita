import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Typography } from '../ui/Typography';
import { useAppState } from '../../state/AppStateContext';

export function GameSection() {
  const { user } = useAppState();

  return (
    <section className="section-template" aria-labelledby="game-heading">
      <div className="section-template__content">
        <Typography variant="display" as="h1" id="game-heading">
          Dharma game hub
        </Typography>
        <Typography variant="body" className="section-template__description">
          Apply the wisdom of the Bhagavad Gita through interactive dilemmas,
          timed memory quests, and reflective challenges. This playground for
          insight is taking shape.
        </Typography>
        <div className="section-template__panels">
          <Card tone="accent">
            <CardHeader>
              <Typography variant="subtitle" as="h2">
                Coming next
              </Typography>
            </CardHeader>
            <CardContent>
              <Typography variant="detail">
                We are designing story-driven scenarios inspired by Arjuna’s
                battlefield conversations with Krishna. You will practice
                decision-making with feedback tuned to your progress level.
              </Typography>
              <Button
                size="sm"
                startIcon="🎮"
                className="section-template__cta"
                variant="primary"
              >
                Preview challenge soon
              </Button>
            </CardContent>
          </Card>
          <Card tone="muted">
            <CardHeader>
              <Typography variant="subtitle" as="h2">
                Sneak peek
              </Typography>
            </CardHeader>
            <CardContent>
              <ul className="section-template__list">
                <li>Daily “Choices of Dharma” scenario with instant wisdom tips.</li>
                <li>Cooperative play to compare your reasoning with fellow seekers.</li>
                <li>Progressive levels that unlock mantras and verses to apply.</li>
              </ul>
              <Typography variant="detail" className="section-template__footer-text">
                {user.name}, your {user.streak}-day streak keeps the inner fire
                glowing. New games will honour that dedication.
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
