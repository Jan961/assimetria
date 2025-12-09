export interface GenerateArticleInput {
  topic?: string;
  tone?: 'casual' | 'professional' | 'technical';
}

export interface GeneratedArticle {
  title: string;
  content: string;
  photoUrl: string | null;
}

class StaticAiClient {
  private readonly defaultPhotoUrl =
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80';

  async generateArticle(input: GenerateArticleInput = {}): Promise<GeneratedArticle> {
    const topic = input.topic?.trim() || 'Auto-generated blog';

    const intro = `Welcome to another edition of our ${topic.toLowerCase()} series.`;
    const body =
      'In this article we explore the daily workflow behind the project, highlighting the trade-offs, the technical debt we avoided, and some of the intentional decisions that keep the stack lean.';
    const outro =
      'Expect incremental updates as we gather telemetry and user feedback. Until then, stay curious and keep experimenting.';

    return {
      title: `${topic} insights for ${new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })}`,
      content: [intro, body, outro].join('\n\n'),
      photoUrl: this.defaultPhotoUrl,
    };
  }
}

const staticAiClient = new StaticAiClient();

export const generateArticleDraft = (input?: GenerateArticleInput): Promise<GeneratedArticle> =>
  staticAiClient.generateArticle(input);
