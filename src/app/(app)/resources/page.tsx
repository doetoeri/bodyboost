import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"

const resources = [
  {
    title: "넓은 어깨를 위한 최고의 맨몸 운동: 파이크 푸시업",
    content: "어깨뽕을 가장 효과적으로 키울 수 있는 맨몸 운동입니다. 일반 푸시업 자세에서 엉덩이를 높이 들어 몸을 '∧' 모양으로 만드세요. 그 상태에서 머리가 바닥에 닿기 직전까지 내려갔다가 올라옵니다. 어깨 전체에 강력한 자극을 줄 수 있습니다.",
    image: "https://picsum.photos/600/400",
    imageHint: "man calisthenics"
  },
  {
    title: "굵은 팔뚝의 지름길: 다이아몬드 푸시업",
    content: "가슴 중앙과 삼두근을 집중적으로 공격하는 운동입니다. 양손을 바닥에 다이아몬드 모양으로 모으고 푸시업을 하세요. 팔이 터질 듯한 자극을 느낄 수 있습니다. 좁은 너비 때문에 균형 잡기가 어려우니, 코어에 힘을 꽉 주고 천천히 수행하는 것이 중요합니다.",
    image: "https://picsum.photos/600/400",
    imageHint: "diamond pushup"
  },
  {
    title: "역삼각형 등을 만드는 핵심: 풀업 & 인버티드 로우",
    content: "등 근육은 남자다운 뒷모습의 핵심입니다. 풀업은 등 상부와 광배근을 넓히는 최고의 운동입니다. 아직 풀업이 어렵다면, 낮은 바나 책상 밑에 누워 몸을 당기는 인버티드 로우부터 시작하세요. 등 전체를 자극하여 역삼각형 몸매의 기초를 다질 수 있습니다.",
    image: "https://picsum.photos/600/400",
    imageHint: "man pull-up"
  },
  {
    title: "꿀벅지를 위한 필수 운동: 런지",
    content: "스쿼트가 하체 운동의 왕이라면, 런지는 왕비입니다. 한 발씩 번갈아 가며 수행하기 때문에 균형감각과 함께 허벅지 앞뒤, 그리고 엉덩이까지 골고루 발달시킬 수 있습니다. 특히 허벅지 바깥쪽과 안쪽 라인을 다듬는 데 효과적입니다.",
    image: "https://picsum.photos/600/400",
    imageHint: "man doing lunges"
  },
]

const heightResources = [
    {
    title: "숨겨진 키 찾기 프로젝트: 키 크는 스트레칭",
    content: "성장판을 자극하고 굽은 자세를 교정해주는 최고의 스트레칭입니다. 매일 밤 자기 전 10분만 투자해보세요. '고양이-소 자세'로 척추를 부드럽게 풀어주고, '코브라 자세'로 닫혀있던 가슴을 활짝 열어주면 척추가 곧게 펴지면서 숨겨진 키를 찾는 데 도움이 됩니다.",
    image: "https://picsum.photos/600/400",
    imageHint: "yoga stretching"
  },
   {
    title: "성장기 필수템: 전신을 쭉쭉 늘리는 농구 & 줄넘기",
    content: "점프 동작은 성장판을 자극하는 가장 좋은 운동 중 하나입니다. 농구처럼 계속 뛰어오르는 운동이나 간단하게 할 수 있는 줄넘기를 꾸준히 해보세요. 무릎에 무리가 가지 않도록 푹신한 신발을 신고, 운동 전후 스트레칭은 필수입니다!",
    image: "https://picsum.photos/600/400",
    imageHint: "basketball jump"
  },
]

export default function ResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">운동 정보</h1>
        <p className="text-muted-foreground">
          몸을 알고 운동하면 효과는 두 배! '패션 근육'과 '키 성장'을 위한 핵심 정보를 알아보세요.
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-primary border-b-2 border-primary/50 pb-2">💪 '패션 근육' 만들기</h2>
        {resources.map((resource, index) => (
          <Card key={index} className="overflow-hidden shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
            <div className="grid md:grid-cols-2">
               <div className="relative h-64 md:h-full min-h-[200px]">
                 <Image src={resource.image} alt={resource.title} fill style={{objectFit: "cover"}} data-ai-hint={resource.imageHint} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-primary">{resource.title}</h3>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{resource.content}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="space-y-8 mt-12">
        <h2 className="text-2xl font-bold text-accent border-b-2 border-accent/50 pb-2">🌱 '키 성장' 솔루션</h2>
        {heightResources.map((resource, index) => (
          <Card key={index} className="overflow-hidden shadow-lg hover:shadow-accent/20 transition-shadow duration-300">
            <div className="grid md:grid-cols-2">
               <div className="relative h-64 md:h-full min-h-[200px]">
                 <Image src={resource.image} alt={resource.title} fill style={{objectFit: "cover"}} data-ai-hint={resource.imageHint} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-accent">{resource.title}</h3>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{resource.content}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>


      <Card className="mt-8">
        <CardHeader>
          <CardTitle>자주 묻는 질문 (FAQ)</CardTitle>
          <CardDescription>운동과 성장에 대해 가장 궁금해하는 것들.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>운동은 매일 해야 하나요?</AccordionTrigger>
              <AccordionContent>
                근육은 쉴 때 성장합니다. 매일 같은 부위를 운동하기보다는, 하루는 상체, 다음 날은 하체, 그리고 하루는 휴식하는 방식으로 분할 운동을 하는 것이 효과적입니다. AI가 짜주는 루틴을 따르면 자연스럽게 분할과 휴식을 관리할 수 있습니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>운동 후 근육통이 너무 심해요. 괜찮은 건가요?</AccordionTrigger>
              <AccordionContent>
                근육통(지연성 근육통, DOMS)은 근육이 성장하고 있다는 좋은 신호입니다. 하지만 통증이 너무 심하다면 운동 강도가 너무 높거나 자세가 잘못되었을 수 있습니다. 가벼운 스트레칭이나 산책으로 혈액순환을 돕고, 통증이 심한 날은 쉬는 것이 좋습니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>얼마나 해야 몸의 변화가 보이나요?</AccordionTrigger>
              <AccordionContent>
                사람마다 다르지만, 꾸준히 주 3-4회 이상 운동하고 잘 챙겨 먹는다면 보통 1~2달 안에 스스로 몸이 단단해지는 것을 느낄 수 있습니다. 눈에 띄는 외적인 변화는 3개월 이상 꾸준히 했을 때 나타나는 경우가 많습니다. 조급해하지 말고 꾸준함을 유지하는 것이 가장 중요합니다!
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger>운동하면 키 안 크나요?</AccordionTrigger>
              <AccordionContent>
                전혀 그렇지 않습니다! 적절한 근력 운동은 성장 호르몬 분비를 촉진시켜 오히려 키 성장에 도움이 될 수 있습니다. 다만, 무거운 무게로 척추에 압박을 주는 운동보다는 자신의 체중을 이용한 맨몸 운동이나 가벼운 무게의 운동이 좋습니다. 성장기에는 균형잡힌 영양 섭취와 충분한 수면이 운동만큼이나 중요합니다.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
