import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { PrimaryButton, SecondaryButton, SuccessButton } from '../styles/ModernButtons';
import { api } from '../services/api';

const Container = styled.div`
  background: ${props => props.$isDark ? 'rgba(26, 29, 37, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(100, 200, 255, 0.2)' : 'rgba(0, 100, 200, 0.2)'};
  border-radius: 16px;
  padding: 32px;
  backdrop-filter: blur(10px);
  margin-top: 48px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #0055ff, #00aaff, #ff5500);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: ${props => props.$isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(245, 245, 245, 0.5)'};
  border: 2px solid ${props => props.$isDark ? 'rgba(100, 200, 255, 0.15)' : 'rgba(0, 100, 200, 0.15)'};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s;

  &:hover {
    border-color: ${props => props.$isDark ? 'rgba(100, 200, 255, 0.3)' : 'rgba(0, 100, 200, 0.3)'};
  }
`;

const FeatureTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${props => props.$isDark ? '#00d9ff' : '#0055ff'};
`;

const FeatureDescription = styled.p`
  font-size: 13px;
  color: ${props => props.$isDark ? '#b0b3b8' : '#666666'};
  margin-bottom: 16px;
  line-height: 1.5;
`;

const OutputContainer = styled.div`
  background: ${props => props.$isDark ? 'rgba(26, 29, 37, 0.5)' : 'rgba(245, 245, 245, 0.8)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(100, 200, 255, 0.15)' : 'rgba(0, 100, 200, 0.15)'};
  border-radius: 8px;
  padding: 16px;
  margin-top: 12px;
  max-height: 300px;
  overflow-y: auto;
`;

const HashtagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Hashtag = styled.span`
  background: linear-gradient(135deg, rgba(0, 85, 255, 0.2), rgba(0, 170, 255, 0.2));
  color: ${props => props.$isDark ? '#00d9ff' : '#0055ff'};
  border: 1px solid ${props => props.$isDark ? 'rgba(0, 200, 255, 0.3)' : 'rgba(0, 85, 255, 0.3)'};
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(135deg, rgba(0, 85, 255, 0.3), rgba(0, 170, 255, 0.3));
    transform: scale(1.05);
  }
`;

const CaptionOption = styled.div`
  background: ${props => props.$isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(245, 245, 245, 0.8)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(100, 200, 255, 0.15)' : 'rgba(0, 100, 200, 0.15)'};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const CaptionText = styled.p`
  font-size: 13px;
  color: ${props => props.$isDark ? '#ffffff' : '#333333'};
  line-height: 1.6;
  margin: 0;
  flex: 1;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const CopyButton = styled.button`
  padding: 6px 12px;
  border: 1px solid ${props => props.$isDark ? 'rgba(100, 200, 255, 0.3)' : 'rgba(0, 100, 200, 0.3)'};
  border-radius: 6px;
  background: ${props => props.$isDark ? 'rgba(0, 85, 255, 0.1)' : 'rgba(0, 85, 255, 0.05)'};
  color: ${props => props.$isDark ? '#00d9ff' : '#0055ff'};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    background: ${props => props.$isDark ? 'rgba(0, 85, 255, 0.2)' : 'rgba(0, 85, 255, 0.1)'};
    border-color: ${props => props.$isDark ? 'rgba(0, 200, 255, 0.5)' : 'rgba(0, 120, 200, 0.5)'};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const SelectsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid ${props => props.$isDark ? 'rgba(100, 200, 255, 0.2)' : 'rgba(0, 100, 200, 0.2)'};
  border-radius: 6px;
  background: ${props => props.$isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(245, 245, 245, 0.8)'};
  color: ${props => props.$isDark ? '#ffffff' : '#333333'};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: 120px;

  &:hover {
    border-color: ${props => props.$isDark ? 'rgba(100, 220, 255, 0.5)' : 'rgba(0, 120, 200, 0.5)'};
  }

  &:focus {
    outline: none;
    border-color: #0055ff;
  }
`;

const LoadingText = styled.p`
  color: ${props => props.$isDark ? '#8a8d93' : '#999999'};
  font-size: 12px;
  font-style: italic;
`;

const AIEnhancements = ({ prompt, carouselContent, isDark }) => {
  const { isDark: themeDark } = useTheme();
  const [showHashtags, setShowHashtags] = useState(false);
  const [hashtags, setHashtags] = useState([]);
  const [hashtagsLoading, setHashtagsLoading] = useState(false);

  const [showCaptions, setShowCaptions] = useState(false);
  const [captionStyle, setCaptionStyle] = useState('catchy');
  const [captionLength, setCaptionLength] = useState('medium');
  const [captions, setCaptions] = useState([]);
  const [captionsLoading, setCaptionsLoading] = useState(false);

  const generateHashtags = async () => {
    setHashtagsLoading(true);
    try {
      const response = await api.post('/generate/hashtags', {
        prompt,
        carouselContent: carouselContent?.slides?.map(s => `${s.headline} ${s.body}`).join(' ') || '',
      });
      setHashtags(response.data.hashtags || []);
    } catch (error) {
      console.error('Error generating hashtags:', error);
      alert('Failed to generate hashtags. Please try again.');
    } finally {
      setHashtagsLoading(false);
    }
  };

  const generateCaptions = async () => {
    setCaptionsLoading(true);
    try {
      const response = await api.post('/generate/captions', {
        prompt,
        carouselContent: carouselContent?.slides?.map(s => `${s.headline} ${s.body}`).join(' ') || '',
        style: captionStyle,
        length: captionLength,
      });
      setCaptions(response.data.captions || []);
    } catch (error) {
      console.error('Error generating captions:', error);
      alert('Failed to generate captions. Please try again.');
    } finally {
      setCaptionsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  return (
    <Container $isDark={themeDark}>
      <Title>Enhancements</Title>

      <FeaturesGrid>
        {/* Hashtag Generator */}
        <FeatureCard $isDark={themeDark}>
          <FeatureTitle $isDark={themeDark}>Hashtag Generator</FeatureTitle>
          <FeatureDescription $isDark={themeDark}>
            Generate 10 relevant hashtags automatically based on your carousel content to increase discoverability.
          </FeatureDescription>

          {!showHashtags ? (
            <PrimaryButton
              onClick={() => {
                setShowHashtags(true);
                generateHashtags();
              }}
              $isDark={themeDark}
              style={{ width: '100%' }}
            >
              Generate Hashtags
            </PrimaryButton>
          ) : (
            <>
              {hashtagsLoading ? (
                <LoadingText $isDark={themeDark}>Generating hashtags...</LoadingText>
              ) : (
                <OutputContainer $isDark={themeDark}>
                  <HashtagList>
                    {hashtags.map((tag, idx) => (
                      <Hashtag
                        key={idx}
                        onClick={() => copyToClipboard(tag)}
                        title="Click to copy"
                      >
                        {tag}
                      </Hashtag>
                    ))}
                  </HashtagList>
                </OutputContainer>
              )}
              <SecondaryButton
                onClick={() => setShowHashtags(false)}
                $isDark={themeDark}
                style={{ width: '100%', marginTop: '12px' }}
              >
                Hide Hashtags
              </SecondaryButton>
            </>
          )}
        </FeatureCard>

        {/* Caption Generator */}
        <FeatureCard $isDark={themeDark}>
          <FeatureTitle $isDark={themeDark}>Meta Descriptions</FeatureTitle>
          <FeatureDescription $isDark={themeDark}>
            Get AI-generated captions tailored to your carousel. Choose style and length for perfect social media posts.
          </FeatureDescription>

          {!showCaptions ? (
            <PrimaryButton
              onClick={() => setShowCaptions(true)}
              $isDark={themeDark}
              style={{ width: '100%' }}
            >
              Generate Captions
            </PrimaryButton>
          ) : (
            <>
              <SelectsContainer>
                <Select
                  value={captionStyle}
                  onChange={(e) => setCaptionStyle(e.target.value)}
                  $isDark={themeDark}
                >
                  <option value="catchy">Catchy</option>
                  <option value="detailed">Detailed</option>
                  <option value="funny">Funny</option>
                </Select>
                <Select
                  value={captionLength}
                  onChange={(e) => setCaptionLength(e.target.value)}
                  $isDark={themeDark}
                >
                  <option value="short">Short (20-50 words)</option>
                  <option value="medium">Medium (50-100 words)</option>
                  <option value="long">Long (100-150 words)</option>
                </Select>
                <SuccessButton
                  onClick={generateCaptions}
                  $isDark={themeDark}
                  disabled={captionsLoading}
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  {captionsLoading ? 'Generating...' : 'Generate'}
                </SuccessButton>
              </SelectsContainer>

              {captionsLoading ? (
                <LoadingText $isDark={themeDark}>Generating captions...</LoadingText>
              ) : captions.length > 0 ? (
                <OutputContainer $isDark={themeDark}>
                  {captions.map((caption, idx) => (
                    <CaptionOption key={idx} $isDark={themeDark}>
                      <CaptionText $isDark={themeDark}>{caption}</CaptionText>
                      <CopyButton
                        $isDark={themeDark}
                        onClick={() => copyToClipboard(caption)}
                        title="Copy caption"
                      >
                        Copy
                      </CopyButton>
                    </CaptionOption>
                  ))}
                </OutputContainer>
              ) : null}

              <SecondaryButton
                onClick={() => setShowCaptions(false)}
                $isDark={themeDark}
                style={{ width: '100%', marginTop: '12px' }}
              >
                Hide Captions
              </SecondaryButton>
            </>
          )}
        </FeatureCard>
      </FeaturesGrid>
    </Container>
  );
};

export default AIEnhancements;
