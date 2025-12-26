import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Users, Calendar, User2Icon, User2, Users2, BookOpen, CheckCircleIcon, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "./skeleton"

const cardVariants = cva(
  "bg-card text-card-foreground flex flex-col border",
  {
    variants: {
      variant: {
        default: "gap-6 rounded-xl py-6 shadow-sm",
        metric: "rounded-lg overflow-hidden border-primary w-75 h-40 shadow-md",
        committee: "rounded-lg bg-white border-gray border-2 gap-3 py-3 w-52 h-40 shadow-md transition-all duration-300 hover:scale-101 hover:shadow-primary/50",
        archive: "rounded-lg bg-accent border-gray border-2 gap-4 py-3 w-110 h-56 shadow-md transition-all duration-300 hover:scale-101 hover:shadow-black/40",
        endorsement: "rounded-lg bg-white border-gray-200 py-3 px-4 gap-5 w-110 h-111 shadow-md transition-all duration-300 hover:scale-101 hover:shadow-primary/40",
        group: "rounded-lg bg-white border-primary border-1 gap-3 py-2 px-3 w-52 h-48 shadow-md transition-all duration-300 hover:scale-101 hover:shadow-primary/40",
        adviseeGroup: "rounded-lg bg-white border-l-primary border-l-5 gap-3 py-1 px-3 w-[416px] h-[134px] shadow-md transition-all duration-300 hover:bg-breadcrumb",
        // dataCard: "rounded-md bg-accent border-primary/25 gap-4 py-6 w-81 h-36 shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const CardContext = React.createContext<{
  variant: VariantProps<typeof cardVariants>["variant"]
}>({
  variant: "default",
})

const cardHeaderVariants = cva("flex flex-col", {
  variants: {
    variant: {
      default: "gap-1.5 px-6",
      metric: "bg-primary text-primary-foreground-2 font-bold px-4 py-3 flex-row items-center gap-2",
      committee: "",
      archive: "",
      endorsement: "",
      group: "",
      dataCard: "",
      adviseeGroup: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const cardTitleVariants = cva("leading-none", {
  variants: {
    variant: {
      default: "font-semibold",
      metric: "font-bold text-md text-primary-foreground-2",
      committee: "font-semibold text-sm text-primary leading-tight break-words",
      archive: "font-bold text-md text-primary leading-tight break-words",
      endorsement: "font-semibold text-xl text-gray-900",
      group: "font-semibold text-md text-primary",    
      dataCard: "font-bold text-[19px] text-center",
      adviseeGroup: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const cardDescriptionVariants = cva("", {
  variants: {
    variant: {
      default: "text-muted-foreground text-sm",
      metric: "",
      committee: "",
      archive: "",
      endorsement: "text-sm text-gray-600",
      group: "text-[8px] text-gray-500",
      dataCard: "",
      adviseeGroup: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const cardContentVariants = cva("", {
  variants: {
    variant: {
      default: "px-6",
      metric: "px-4",
      committee: "px-3 text-[10px] text-bold",
      archive: "",
      endorsement: "",
      group: "",
      dataCard: "",
      adviseeGroup: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const cardFooterVariants = cva("flex items-center", {
  variants: {
    variant: {
      default: "px-6",
      metric: "",
      committee: "px-3",
      archive: "",
      endorsement: "",
      group: "",
      dataCard: "",
      adviseeGroup: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

// Card Component
interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

function Card({ className, variant, ...props }: CardProps) {
  return (
    <CardContext.Provider value={{ variant }}>
      <div
        data-slot="card"
        className={cn(cardVariants({ variant }), className)}
        {...props}
      />
    </CardContext.Provider>
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  const { variant } = React.useContext(CardContext)
  
  return (
    <div
      data-slot="card-header"
      className={cn(cardHeaderVariants({ variant }), className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  const { variant } = React.useContext(CardContext)
  
  return (
    <div
      data-slot="card-title"
      className={cn(cardTitleVariants({ variant }), className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  const { variant } = React.useContext(CardContext)
  
  return (
    <div
      data-slot="card-description"
      className={cn(cardDescriptionVariants({ variant }), className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  const { variant } = React.useContext(CardContext)
  
  return (
    <div
      data-slot="card-content"
      className={cn(cardContentVariants({ variant }), className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  const { variant } = React.useContext(CardContext)
  
  return (
    <div
      data-slot="card-footer"
      className={cn(cardFooterVariants({ variant }), className)}
      {...props}
    />
  )
}

function CardBadge({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-badge"
      className={cn("flex items-center gap-2 font-semibold px-6 py-3 text-sm", className)}
      {...props}
    />
  )
}

function CardIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-icon"
      className={cn("flex items-center justify-center", className)}
      {...props}
    />
  )
}

// Archive Card Component
interface ArchiveCardProps {
  title: string
  members: string[]
  date: string
  badges: string[]
  onViewAbstract?: () => void
  className?: string
}

function ArchiveCard({
  title,
  members,
  date,
  badges,
  onViewAbstract,
  className
}: ArchiveCardProps) {
  return (
    <Card variant="archive" className={className}>
      <div className="px-5 w-full h-50 overflow-hidden relative">
      <CardHeader>
          <div className="w-full h-15 overflow-hidden relative">
          <CardTitle>{title}</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <div className="w-full h-21 overflow-hidden relative">
              <CardDescription className="text-black text-sm">

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Users className="w-4 h-4 text-primary" />
                  <p className="truncate">{members.join(", ")}</p>
                </div>

                <div className="flex items-center gap-2 py-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <p>{date}</p>
                </div>

                <div className="flex flex-wrap gap-2 mt-1">
                  {badges.map((badge, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="border-primary text-primary h-4.5"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardDescription>
            </div>
      </CardContent>
      </div>

      <CardFooter className="px-5 py-0.5">
        <div className="w-full h-9 relative">
          <Button onClick={onViewAbstract}>View Abstract</Button>
        </div>
      </CardFooter>
    </Card>
  )
}

// Committee Card Component
interface CommitteeCardProps {
  thesisTitle: string
  adviserName: string
  blockSection: string
  progress: number  // 0-100
  currentStage: number
  totalStages: number
  className?: string
}

function CommitteeCard({
  thesisTitle,
  adviserName,
  blockSection,
  progress,
  currentStage,
  totalStages,
  className
}: CommitteeCardProps) {
  return (
    <Card variant="committee" className={className}>
      <CardHeader className="px-3">
        <div className="w-full h-13 overflow-hidden relative">
          <CardTitle>{thesisTitle}</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="w-full h-8 overflow-hidden relative">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Users className="w-3 h-3 text-black/50" />
            <p className="text-[10px] text-black/50 text-semibold truncate">
              {adviserName}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <BookOpen className="w-3 h-3 text-black/50" />
            <p className="text-[10px] text-black/50">{blockSection}</p>
          </div>
        </div>
      </CardContent>

      <div className="border-t border-gray/50 mx-3" />

      <CardFooter>
        <span className="text-[10px] text-black/50 w-12 text-center flex-shrink-0">
          {currentStage}/{totalStages}
        </span>
        <div className="flex-1 flex justify-end">
          <Skeleton variant="progress" progress={progress} className="w-25 h-1 bg-gray-300" />
        </div>
      </CardFooter>
    </Card>
  )
}

// Group Card Component (Used in Student Management)
interface GroupCardProps {
  groupCode: string
  groupDescription: string
  thesisTitle: string
  thesisStage: string
  members: string[]
  adviserName: string
  onViewGroup?: () => void
  className?: string
}

function GroupCard({
  groupCode,
  groupDescription,
  thesisTitle,
  thesisStage,
  members,
  adviserName,
  onViewGroup,
  className
}: GroupCardProps) {
  return (
    <Card variant="group" className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 fill-primary text-primary flex-shrink-0" />
          <div className="flex flex-col">
            <CardTitle className="text-primary">{groupCode}</CardTitle>
            <CardDescription>{groupDescription}</CardDescription>
          </div>
        </div>
        {/* Divider line */}
        <div className="w-full border-t border-primary/25" />
      </CardHeader>

      <CardContent>
        <div className="w-full h-22">
          <div className="w-full h-10 overflow-hidden relative">
          <p className="text-black text-semibold text-[10px]">{thesisTitle}</p>
          </div>
          
          <div className="px-2 py-1 flex flex-col gap-1">
            <p className="text-[7px] text-black/50">{thesisStage}</p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Users className="w-2.5 h-2.5 text-black/50" />
              <p className="text-[7.5px] text-black/50 truncate">
                {members.join(", ")}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Users className="w-2.5 h-2.5 text-black/50" />
              <p className="text-[7.5px] text-black/50 truncate">{adviserName}</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <Button 
          variant="link" 
          className="text-[8px] p-0 h-auto"
          onClick={onViewGroup}
        >
          View Group
        </Button>
      </CardFooter>
    </Card>
  )
}

// Endorsement Card Component
interface EndorsementCardProps {
  thesisTitle: string
  groupCode: string
  badge?: string
  proponents: string[]
  block: string
  adviserName: string
  approvalDate: string | Date
  panelMembers?: string[]  // Optional for now since there are no dropdowns yet
  onViewManuscript?: () => void
  onEndorse?: () => void
  className?: string
}

function EndorsementCard({
  thesisTitle,
  groupCode,
  badge,
  proponents,
  block,
  adviserName,
  approvalDate,
  panelMembers,
  onViewManuscript,
  onEndorse,
  className
}: EndorsementCardProps) {
  
  const formattedDate = approvalDate instanceof Date 
    ? approvalDate.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })
    : approvalDate;

  return (
    <Card variant="endorsement" className={className}>
      <div className="w-full h-22 overflow-hidden">
        <CardHeader>
          <div className="w-full h-17 overflow-hidden flex items-start justify-between">
            <CardTitle className="text-md font-semibold">{thesisTitle}</CardTitle>
            {badge && (
              <div className="border border-border w-[94px] h-[23px] text-xs flex-shrink-0 flex items-center justify-center">
                {badge}
              </div>
            )}
          </div>
          <CardDescription>{groupCode}</CardDescription>
        </CardHeader>
      </div>

      <CardContent>
        <div className="w-full h-21 overflow-hidden relative">
          <div className="w-full h-10 overflow-hidden relative">
            <p className="text-[12px] text-gray-600">Proponents</p>
            <p className="text-sm truncate font-semibold">{proponents.join(", ")}</p>
          </div>

          <div className="w-full h-11 overflow-hidden relative">
            <div className="grid grid-cols-3 gap-4">
              {/* Block */}
              <div>
                <p className="text-[12px] text-gray-600 mb-1">Block</p>
                <p className="text-sm font-semibold">{block}</p>
              </div>

              {/* Adviser */}
              <div>
                <p className="text-[12px] text-gray-600 mb-1">Adviser</p>
                <p className="text-sm font-semibold truncate">{adviserName}</p>
              </div>

              {/* Approval Date */}
              <div>
                <p className="text-[12px] text-gray-600 mb-1">Approval Date</p>
                <p className="text-sm font-semibold">{formattedDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Members */}
        <div className="w-full h-40 border border-border overflow-hidden relative">
          <p className="text-[12px] text-gray-600">Panel Members</p>
          {!panelMembers || panelMembers.length === 0 ? (
            <p className="text-[12px] text-gray-600 text-center">No Dropdowns Yet</p>
          ) : (
            <div className="space-y-2">
              {panelMembers.map((member, index) => (
                <p key={index} className="text-sm">{member}</p>
              ))}
            </div>
          )}
          {/* Dropdowns Here */}
        </div>
      </CardContent>

      <CardFooter>
        <div className="w-full h-11 overflow-hidden relative">
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="negativelight" 
              className="w-full text-black flex items-center justify-center gap-2"
              onClick={onViewManuscript}
            >
              <Eye className="w-4 h-4" />
              View Manuscript
            </Button>
            <Button 
              variant="negativelight" 
              className="w-full text-black flex items-center justify-center gap-2"
              onClick={onEndorse}
            >
              <CheckCircleIcon className="w-4 h-4" />
              Endorse
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

// Advisee Group Card Component (Thesis Adviser/Panel)
interface AdviseeGroupCardProps {
  groupCode: string
  badge?: string
  thesisTitle: string
  section: string
  contentPlaceholder?: string
  className?: string
}

function AdviseeGroupCard({
  groupCode,
  badge,
  thesisTitle,
  section,
  contentPlaceholder = "Content goes here",
  className
}: AdviseeGroupCardProps) {
  return (
    <Card variant="adviseeGroup" className={className}>
      <CardHeader>
        {/* Group Code and Badge */}
        <div className="flex items-center justify-between">
          <CardTitle className="text-primary font-bold text-lg">{groupCode}</CardTitle>
          {badge && <Badge>{badge}</Badge>}
        </div>
        
        {/* Thesis Title */}
        <div className="flex items-center gap-2">
          <CardTitle className="text-primary font-semibold text-sm truncate">
            {thesisTitle}
          </CardTitle>
        </div>
        
        {/* Block/Section Badge */}
        <Badge className="h-3 text-xs">{section}</Badge>
      </CardHeader>

      {/* Divider Line */}
      <div className="w-full border-t border-gray-300" />
      
      <CardContent>
        {/* Content */}
        <div className="space-y-0.5 text-[8px] text-gray-600">
          <h1>{contentPlaceholder}</h1>
          <div className="flex items-center gap-1.5">
            
          </div>
          <div className="flex items-center gap-1.5">
            
          </div>
          <div className="flex items-center gap-1.5">
            
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardBadge,
  CardIcon,
  ArchiveCard,
  CommitteeCard,
  GroupCard,
  EndorsementCard,
  AdviseeGroupCard
}