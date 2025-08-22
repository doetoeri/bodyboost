import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const resources = [
  {
    title: "Proper Warm-up Techniques",
    content: "Warming up is crucial to prevent injuries and prepare your body for exercise. A good warm-up should last 5-10 minutes and include light cardio (like jogging in place or jumping jacks) followed by dynamic stretches. Dynamic stretches involve moving parts of your body and gradually increasing reach, speed of movement, or both. Examples include arm circles, leg swings, and torso twists. Avoid static stretching (holding a stretch for a long time) before a workout, as it can sometimes decrease performance. Save static stretching for your cool-down.",
    image: "https://placehold.co/600x400.png",
    imageHint: "woman stretching"
  },
  {
    title: "Nutrition Basics for Students",
    content: "As a student, your brain and body need fuel to perform well. Focus on a balanced diet with three main macronutrients: carbohydrates for energy (whole grains, fruits, vegetables), proteins for muscle repair and growth (lean meats, beans, tofu), and fats for hormone production and vitamin absorption (avocados, nuts, olive oil). Try to eat regular meals and snacks to maintain energy levels throughout the day. Hydration is also key, so drink plenty of water. Avoid sugary drinks and processed foods, which can lead to energy crashes.",
    image: "https://placehold.co/600x400.png",
    imageHint: "healthy food"
  },
  {
    title: "Understanding Bodyweight vs. Dumbbell Exercises",
    content: "Bodyweight exercises use your own weight as resistance (e.g., push-ups, squats, planks). They are great for building foundational strength, stability, and can be done anywhere. Dumbbell exercises add external weight, which allows for progressive overload—the process of gradually increasing the stress on your muscles to stimulate growth. Dumbbells are versatile and can be used to target specific muscle groups more effectively than some bodyweight movements. A good routine often incorporates both for a well-rounded fitness plan.",
    image: "https://placehold.co/600x400.png",
    imageHint: "person lifting dumbbells"
  },
  {
    title: "Common Workout Mistakes to Avoid",
    content: "1. **Skipping the Warm-up:** Increases risk of injury. \n2. **Poor Form:** Leads to injury and less effective workouts. Focus on quality over quantity. \n3. **Overtraining:** Not giving your body enough time to rest and recover can hinder progress. \n4. **Ignoring Nutrition:** Your diet is just as important as your workout. \n5. **Lack of Consistency:** Results come from regular, consistent effort over time. Don't get discouraged if you don't see changes immediately.",
    image: "https://placehold.co/600x400.png",
    imageHint: "runner tired"
  },
]

export default function ResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-1.5 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Educational Resources</h1>
        <p className="text-muted-foreground">
          Knowledge is power. Learn more about fitness and nutrition to boost your results.
        </p>
      </div>

      <div className="space-y-6">
        {resources.map((resource, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                <p className="text-muted-foreground whitespace-pre-line">{resource.content}</p>
              </div>
              <div className="relative h-64 md:h-full min-h-[200px]">
                 <Image src={resource.image} alt={resource.title} fill style={{objectFit: "cover"}} data-ai-hint={resource.imageHint} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardContent className="p-6">
           <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How often should I work out?</AccordionTrigger>
              <AccordionContent>
                For beginners, 2-3 times per week is a great start. As you get stronger, you can increase to 4-5 times a week. Listen to your body and make sure to include rest days.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it okay to work out when I'm sore?</AccordionTrigger>
              <AccordionContent>
                Mild soreness (DOMS - Delayed Onset Muscle Soreness) is normal. You can do light activity like walking or stretching. If the pain is sharp or severe, it's best to rest or consult a professional.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How long will it take to see results?</AccordionTrigger>
              <AccordionContent>
                It varies for everyone, but with consistent effort in both your workouts and diet, you might start feeling stronger and more energetic in a few weeks. Visible changes typically take a couple of months. Consistency is key!
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
