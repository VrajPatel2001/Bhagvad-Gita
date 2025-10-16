import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressIndicator } from '../ui/ProgressIndicator';
import { Typography } from '../ui/Typography';
import { useAppState } from '../../state/AppStateContext';
import type { QuickAction } from '../../state/AppStateContext';

const reflectionCardId = 'daily-reflection-card';

export function HomeScreen() {
  const {
    user,
    learningPaths,
    selectedLearningPath,
    quickActions,
    setActiveSection,
    selectLearningPath,
  } = useAppState();

  const averageProgress = useMemo(() => {
    if (learningPaths.length === 0) {
      return 0;
    }

    const total = learningPaths.reduce((sum, path) => sum + path.progress, 0);
    return total / learningPaths.length;
  }, [learningPaths]);

  const overallProgressPercentage = Math.round(averageProgress * 100);

  const focusReflectionCard = () => {
    if (typeof document === 'undefined') {
      return;
    }

    const target = document.getElementById(reflectionCardId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    if (action.targetLearningPathId) {
      selectLearningPath(action.targetLearningPathId);
    }

    if (action.action === 'home') {
      focusReflectionCard();
      return;
    }

    setActiveSection(action.action);
  };

  const handleLearningPathSelection = (pathId: string) => {
    selectLearningPath(pathId);
    setActiveSection('reader');
  };

  return (
    <div className="home-screen">
      <section className="home-hero" aria-labelledby="home-hero-heading">
        <div className="home-hero__intro">
          <Typography variant="eyebrow" className="home-hero__tag">
            Daily guidance
          </Typography>
          <Typography variant="display" as="h1" id="home-hero-heading">
            Welcome back, {user.name}
          </Typography>
          <Typography variant="body" className="home-hero__summary">
            Krishna reminds Arjuna to act with clarity and steadiness. Let’s step
            into today’s practice with the same centered courage.
          </Typography>
          <div className="home-hero__actions">
            <Button
              startIcon="📖"
              onClick={() => setActiveSection('reader')}
              aria-label={`Resume reading ${selectedLearningPath.nextChapter}`}
            >
              Resume {selectedLearningPath.nextChapter}
            </Button>
            <Button
              variant="secondary"
              startIcon="🎮"
              onClick={() => setActiveSection('game')}
            >
              Play a dharma challenge
            </Button>
          </div>
        </div>
        <div className="home-hero__panels">
          <Card tone="accent" className="home-hero__panel">
            <CardHeader>
              <Typography variant="subtitle" as="h2">
                Your current focus
              </Typography>
            </CardHeader>
            <CardContent>
              <Typography variant="title" as="p" weight="semibold">
                {selectedLearningPath.title}
              </Typography>
              <Typography variant="detail" className="home-hero__description">
                {selectedLearningPath.description}
              </Typography>
              <ProgressIndicator
                value={selectedLearningPath.progress}
                label="Path progress"
                helperText={`Next step: ${selectedLearningPath.nextChapter}`}
              />
            </CardContent>
            <CardFooter>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setActiveSection('reader')}
                endIcon="→"
              >
                Go to reader
              </Button>
            </CardFooter>
          </Card>
          <Card tone="muted" className="home-hero__panel">
            <CardContent>
              <Typography variant="subtitle" as="h2">
                Journey overview
              </Typography>
              <ProgressIndicator
                value={averageProgress}
                label="Average progress"
                helperText={`${overallProgressPercentage}% of planned readings & games`}
              />
              <Typography variant="detail" className="home-hero__description">
                You are on a {user.streak}-day streak. Consistency transforms
                knowledge into wisdom.
              </Typography>
            </CardContent>
          </Card>
        </div>
      </section>

      <section
        className="home-quick-actions"
        aria-labelledby="quick-actions-heading"
      >
        <div className="section-header">
          <div>
            <Typography variant="subtitle" as="h2" id="quick-actions-heading">
              Quick actions
            </Typography>
            <Typography variant="detail">
              Continue a verse, play a scenario, or capture today’s insights.
            </Typography>
          </div>
        </div>
        <div className="home-quick-actions__grid">
          {quickActions.map((action) => (
            <Card key={action.id} interactive tone="default">
              <CardHeader>
                <Typography variant="label" weight="medium">
                  {action.label}
                </Typography>
              </CardHeader>
              <CardContent>
                <Typography variant="detail">{action.description}</Typography>
              </CardContent>
              <CardFooter>
                <Button size="sm" onClick={() => handleQuickAction(action)}>
                  Start now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section
        className="home-learning-paths"
        aria-labelledby="learning-paths-heading"
      >
        <div className="section-header">
          <div>
            <Typography
              variant="subtitle"
              as="h2"
              id="learning-paths-heading"
            >
              Learning paths
            </Typography>
            <Typography variant="detail">
              Choose the rhythm that matches your curiosity today.
            </Typography>
          </div>
          <Button variant="ghost" size="sm" aria-label="View all paths">
            View all paths
          </Button>
        </div>
        <div className="home-learning-paths__grid">
          {learningPaths.map((path) => {
            const isSelected = path.id === selectedLearningPath.id;
            return (
              <Card
                key={path.id}
                tone={isSelected ? 'accent' : 'default'}
                interactive
                className="home-learning-path"
              >
                <CardHeader>
                  <Typography variant="eyebrow">
                    {path.type === 'reading' ? 'Reading journey' : 'Playful practice'}
                  </Typography>
                  <Typography variant="title" as="h3" weight="semibold">
                    {path.title}
                  </Typography>
                </CardHeader>
                <CardContent>
                  <Typography variant="detail" className="home-learning-path__description">
                    {path.description}
                  </Typography>
                  <Typography variant="label" className="home-learning-path__focus">
                    Focus: {path.focus}
                  </Typography>
                  <ProgressIndicator
                    value={path.progress}
                    label="Progress"
                    helperText={`Next up: ${path.nextChapter}`}
                  />
                </CardContent>
                <CardFooter className="home-learning-path__actions">
                  <Button
                    size="sm"
                    variant={isSelected ? 'primary' : 'secondary'}
                    startIcon={isSelected ? '📍' : '🧭'}
                    onClick={() => handleLearningPathSelection(path.id)}
                  >
                    {isSelected ? 'Continue this path' : 'Switch to this path'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    endIcon="→"
                    onClick={() => setActiveSection('reader')}
                  >
                    Open reader
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="home-insights" aria-labelledby="insights-heading">
        <div className="section-header">
          <div>
            <Typography variant="subtitle" as="h2" id="insights-heading">
              Reflection & inspiration
            </Typography>
            <Typography variant="detail">
              Anchor your learning with mindfulness and gentle practice.
            </Typography>
          </div>
        </div>
        <div className="home-insights__grid">
          <Card
            id={reflectionCardId}
            tone="muted"
            className="home-insight"
            tabIndex={-1}
            aria-labelledby="reflection-heading"
          >
            <CardHeader>
              <Typography variant="title" as="h3" id="reflection-heading">
                Daily reflection
              </Typography>
            </CardHeader>
            <CardContent>
              <Typography variant="detail">
                Take a deep breath and note one situation where you can act with
                equanimity today. How would Krishna guide you to respond?
              </Typography>
            </CardContent>
            <CardFooter>
              <Button
                size="sm"
                variant="secondary"
                startIcon="📝"
                onClick={focusReflectionCard}
              >
                Log reflection
              </Button>
            </CardFooter>
          </Card>
          <Card tone="default" className="home-insight" aria-labelledby="verse-heading">
            <CardHeader>
              <Typography variant="title" as="h3" id="verse-heading">
                Verse for contemplation
              </Typography>
            </CardHeader>
            <CardContent>
              <Typography variant="detail" className="home-insight__verse">
                “Yoga is skill in action.” — Chapter 2, Verse 50. Reflect on how
                purposeful effort transforms everyday tasks.
              </Typography>
            </CardContent>
            <CardFooter>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setActiveSection('reader')}
                endIcon="→"
              >
                Read commentary
              </Button>
            </CardFooter>
          </Card>
          <Card tone="accent" className="home-insight" aria-labelledby="scenario-heading">
            <CardHeader>
              <Typography variant="title" as="h3" id="scenario-heading">
                Tonight’s scenario teaser
              </Typography>
            </CardHeader>
            <CardContent>
              <Typography variant="detail">
                A friend asks you to bend a principle for convenience. Will you
                stay steadfast or adapt? Explore choices rooted in dharma.
              </Typography>
            </CardContent>
            <CardFooter>
              <Button
                size="sm"
                variant="primary"
                startIcon="🎮"
                onClick={() => setActiveSection('game')}
              >
                Preview challenge
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
