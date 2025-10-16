import { CHAPTERS } from '../data/course';
import { useProgressStore } from '../store/progressStore';

const ChaptersOverview = () => {
  const chaptersRead = useProgressStore((state) => state.chaptersRead);
  const markChapterComplete = useProgressStore((state) => state.markChapterComplete);

  return (
    <div>
      <div className="section-title">
        <h2>Chapters</h2>
      </div>
      <div className="chapter-list">
        {CHAPTERS.map((chapter) => {
          const completed = chaptersRead.find((entry) => entry.id === chapter.id);

          return (
            <div
              key={chapter.id}
              className={`list-item ${completed ? 'completed' : ''}`}
            >
              <div>
                <strong>{chapter.title}</strong>
                <p className="helper-text" style={{ margin: '0.35rem 0 0' }}>
                  Difficulty: {chapter.difficulty.charAt(0).toUpperCase() + chapter.difficulty.slice(1)} ·
                  {' '}
                  {chapter.estimatedMinutes} min
                </p>
                {completed ? (
                  <p className="small-label" style={{ marginTop: '0.4rem' }}>
                    Completed on {new Date(completed.completedAt).toLocaleDateString()}
                  </p>
                ) : null}
              </div>
              <button
                className="secondary-button"
                type="button"
                disabled={Boolean(completed)}
                onClick={() => markChapterComplete(chapter)}
              >
                {completed ? 'Completed' : 'Mark Complete'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChaptersOverview;
