export type TargetLevel = 'freshgrad' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';

export type StrictnessMode = 'savage_brutal' | 'stern_hr' | 'constructive_pro' | 'ats_robot';

export type AppMode = 'cv_roaster' | 'digital_footprint' | 'github_roaster';

export interface ScoreCategory {
  score: number;
  max: 20;
  feedback: string;
  status: 'critical' | 'warning' | 'good';
}

export interface FatalRedFlag {
  title: string;
  explanation: string;
  severity: 'high' | 'medium' | 'low';
  fix: string;
}

export interface BuzzwordAudit {
  word: string;
  whyItSucks: string;
  replacement: string;
}

export interface BulletPointRewrite {
  original: string;
  whyWeak: string;
  improvedSTAR: string;
  impactExplained: string;
}

export interface ATSSimulation {
  parseScore: number;
  matchedKeywords: string[];
  missingCriticalKeywords: string[];
  formattingRisks: string[];
}

export interface SectionCritique {
  roast: string;
  recommendation: string;
  rating: 'Sangat Buruk' | 'Perlu Dirombak' | 'Cukup' | 'Bagus';
}

export interface ActionPlanItem {
  step: number;
  priority: 'Darurat (Segera)' | 'Penting' | 'Penyempurnaan';
  action: string;
  example: string;
}

export interface CVReviewResult {
  overallScore: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  verdictTag: string;
  summaryRoast: string;
  scoreBreakdown: {
    impactAndMetrics: ScoreCategory;
    atsCompatibility: ScoreCategory;
    actionVerbsAndClarity: ScoreCategory;
    skillsAndKeywords: ScoreCategory;
    careerStoryAndRelevance: ScoreCategory;
  };
  fatalRedFlags: FatalRedFlag[];
  buzzwordAudit: BuzzwordAudit[];
  bulletPointRewrites: BulletPointRewrite[];
  atsSimulation: ATSSimulation;
  sectionBySectionCritique: {
    headerAndSummary: SectionCritique;
    workExperience: SectionCritique;
    skillsAndTools: SectionCritique;
    educationAndCertifications: SectionCritique;
    layoutAndLength: SectionCritique;
  };
  stepByStepActionPlan: ActionPlanItem[];
  sampleFullCvRewriteSnippet?: string;
}

export interface CVReviewRequest {
  cvText: string;
  fileData?: {
    mimeType: string;
    data: string;
    fileName: string;
  };
  targetRole: string;
  targetLevel: TargetLevel;
  industry: string;
  jobDescription?: string;
  strictnessMode: StrictnessMode;
  language: 'id' | 'en';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'hr';
  text: string;
  timestamp: string;
}

// ==========================================
// FITUR JEJAK DIGITAL (DIGITAL FOOTPRINT)
// ==========================================
export interface DigitalFootprintRequest {
  cvText?: string;
  targetRole: string;
  candidateName?: string;
  linkedinUrlOrBio?: string;
  twitterUrlOrBio?: string;
  githubUrlOrBio?: string;
  portfolioOrBlog?: string;
  additionalNotes?: string;
  language?: 'id' | 'en';
}

export interface FootprintInconsistency {
  claimInCv: string;
  foundInDigitalFootprint: string;
  severity: 'critical' | 'warning' | 'minor';
  analysis: string;
}

export interface VerifiedHighlight {
  skillOrExperience: string;
  evidence: string;
  credibilityNote: string;
}

export interface DigitalFootprintResult {
  authenticityScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  verdict: string;
  summaryRoast: string;
  digitalPersonaAudit: {
    professionalismRating: string;
    toneRoast: string;
    onlineActivityRisk: string;
  };
  inconsistencies: FootprintInconsistency[];
  verifiedHighlights: VerifiedHighlight[];
  backgroundCheckAdvice: Array<{
    action: string;
    whyItMatters: string;
  }>;
}

// ==========================================
// FITUR GITHUB ROASTED (PROGRAMMER EDITION)
// ==========================================
export interface GitHubRoastRequest {
  username: string;
  targetRole?: string;
  claimedTechStack?: string;
  manualRepoInfo?: string;
  language?: 'id' | 'en';
}

export interface RepoTeardown {
  repoName: string;
  techStack: string[];
  roast: string;
  verdict: string;
  howToFix: string;
}

export interface GitHubAchievementItem {
  title: string;
  status: string;
  badge: string;
  description: string;
  roastComment: string;
}

export interface GitHubRoadmapMilestone {
  timeframe: string;
  milestoneTitle: string;
  actionItems: string[];
  expectedImpact: string;
}

export interface GitHubHRVerdict {
  hiringDecision?: string;
  recruiterVerdict?: string;
  salaryNegotiationImpact?: string;
  salaryNegotiationPower?: string;
  hrRedFlags?: string[];
  hrGreenFlags?: string[];
  interviewSurvivability?: number;
  cvVsGithubIntegrityCheck?: string;
  first6SecondsRoast?: string;
}

export interface GitHubHistoryAudit {
  accountAge?: string;
  commitStreakRoast?: string;
  peakActivityPeriod?: string;
  dormancyWarning?: string;
  prAndIssuesRoast?: string;
  commitFrequencyAnalysis?: string;
  commitMessageRoast?: string;
  activeHabitsPattern?: string;
  prAndIssuesCollaboration?: string;
  greenSquareVerdict?: string;
}

export interface GitHubFullActivityBreakdown {
  pullRequestsCount: number;
  mergedPRsCount: number;
  openIssuesCount: number;
  starredReposCount: number;
  forksGivenOrReceived: string;
  codeReviewAndDiscussions: string;
  communityEngagementGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  activitySummaryRoast: string;
}

export interface GitHubRoastResult {
  username: string;
  auditMode?: 'general_profile' | 'targeted_role';
  detectedDeveloperRole?: string;
  targetRoleEvaluated?: string;
  realNameOrBio?: string;
  avatarUrl?: string;
  devScore: number;
  devTier: string;
  verdictTag: string;
  brutalRoast: string;
  activityBreakdown?: GitHubFullActivityBreakdown;
  profileSummary?: {
    avatarUrl?: string;
    name?: string;
    bio?: string;
    company?: string;
    location?: string;
    followers?: number;
    following?: number;
    publicRepos?: number;
    accountAgeYears?: number;
    createdAt?: string;
    profileUrl?: string;
  };
  metricsAudit: {
    repoCount: number;
    starsTotal: number;
    forksTotal?: number;
    followersCount?: number;
    followingCount?: number;
    topLanguages: string[];
    commitConsistencyScore: number;
    readmeQualityScore: number;
    openSourceContributionScore?: number;
  };
  hrVerdict?: GitHubHRVerdict;
  historyAudit?: GitHubHistoryAudit;
  achievementsAudit?: GitHubAchievementItem[] | {
    detectedBadgesOrAchievements?: string[];
    reputationTier?: string;
    starsVsForksRatioRoast?: string;
    communityInfluence?: string;
  };
  roastCategories: {
    tutorialHellDiagnosis: {
      status: 'safe' | 'warning' | 'severe';
      explanation: string;
    };
    codeSmellAndQuality: {
      status: 'safe' | 'warning' | 'severe';
      explanation: string;
    };
    commitHabitsAndMessages: {
      status: 'safe' | 'warning' | 'severe';
      explanation: string;
    };
    techStackVsCvAlignment: {
      status: 'aligned' | 'questionable' | 'fake';
      explanation: string;
    };
  };
  repoTeardowns: RepoTeardown[];
  portfolioUpgradeBlueprint: Array<{
    projectName: string;
    architectureSuggested: string;
    whyRecruitersLoveIt: string;
  }>;
  futureCareerRoadmap?: GitHubRoadmapMilestone[];
  futureRoadmap?: {
    thirtyDayEmergencyPlan?: string[];
    sixtyDayProductionProjects?: Array<{
      projectName: string;
      targetRoleAlignment: string;
      architecture: string;
      killerFeatures: string[];
      whyItImpressesHR: string;
    }>;
    ninetyDayOpenSourceAndAuthority?: string[];
    readmeTransformationGuide?: string;
  };
}
