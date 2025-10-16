import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Typography } from '../ui/Typography';
import { ProgressIndicator } from '../ui/ProgressIndicator';
import { useAppState } from '../../state/AppStateContext';

export function ReaderSection() {
  const { selectedLearningPath } = useAppState();

  return (
    <section className="section-template" aria-labelledby="reader-heading">
      <div className="section-template__content">
        <Typography variant="display" as="h1" id="reader-heading">
          Bhagavad Gita reader
        </Typography>
        <Typography variant="body" className="section-template__description">
          A focused reading experience with verse-by-verse commentary,
          transliteration, and reflective prompts is coming next. For now, stay
          centered on your current path.
        </Typography>
        <div className="section-template__panels">
          <Card tone="accent">
            <CardHeader>
              <Typography variant="subtitle" as="h2">
                Current focus
              </Typography>
            </CardHeader>
            <CardContent>
              <Typography variant="title" as="p" weight="semibold">
                {selectedLearningPath.title}
              </Typography>
              <Typography variant="detail">
                {selectedLearningPath.description}
              </Typography>
              <ProgressIndicator
                value={selectedLearningPath.progress}
                label="Progress"
                helperText={`Next verse: ${selectedLearningPath.nextChapter}`}
              />
              <Button
                size="sm"
                variant="primary"
                startIcon="📖"
                className="section-template__cta"
              >
                Continue reading soon
              </Button>
            </CardContent>
          </Card>
          <Card tone="muted">
            <CardHeader>
              <Typography variant="subtitle" as="h2">
                Upcoming features
              </Typography>
            </CardHeader>
            <CardContent>
              <ul className="section-template__list">
                <li>Personalized verse queue aligned with your selected path.</li>
                <li>Audio recitations to chant along with pronunciation guides.</li>
                <li>
                  Reflection markers to capture how each teaching lands with you.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
