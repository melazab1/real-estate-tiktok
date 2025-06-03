
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const WhatsNextSection = () => {
  const tips = [
    "Upload to TikTok, Instagram Reels, or YouTube Shorts",
    "Use trending hashtags related to real estate",
    "Post during peak engagement hours",
    "Engage with comments to boost reach"
  ];

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-purple-800">What's Next?</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-purple-700">
              <span className="text-purple-600 font-bold">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
