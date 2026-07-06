import Image from 'next/image';

import { Container, Section, Typography } from '@/components/ui';
import { ourStory } from '@/constants/home-content';

export function OurStorySection() {
  return (
    <Section id="our-story" className="bg-surface-muted">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-accent/20 blur-xl" />
            <div className="relative overflow-hidden rounded-2xl shadow-elevated">
              <Image
                src={ourStory.image}
                alt="Our story"
                width={800}
                height={600}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-6">
            <Typography variant="overline">Our Story</Typography>
            <Typography variant="h2">{ourStory.title}</Typography>
            {ourStory.paragraphs.map((p) => (
              <Typography key={p.slice(0, 40)} variant="body" className="text-muted-foreground">
                {p}
              </Typography>
            ))}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {ourStory.stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <Typography variant="h3" className="text-secondary">
                    {stat.value}
                  </Typography>
                  <Typography variant="caption">{stat.label}</Typography>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
