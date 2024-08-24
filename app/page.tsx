import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";

export default function Home() {
  return (
   <main className="relative dark:bg-black-100 bg-gray-50 flex justify-center items-center flex-col overflow-hidden mx-auto px-0">
    <div className=" w-full">
      <Hero/>
      {/* <Grid/> */}
      <Projects/>
      <h2>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit, officia ut dolorum id, commodi aliquid earum, nemo exercitationem doloribus illo natus quam nisi. Eos facere natus, corporis in molestias ad tempore neque dolor fugit suscipit aut illo quis eligendi iure, sunt doloremque vitae accusantium similique omnis fugiat eveniet mollitia iusto pariatur? Minima eligendi, cumque neque magni eveniet, sit quo voluptas iusto esse consectetur facilis voluptate. Tenetur cupiditate fugiat reprehenderit quis, quaerat maiores doloribus! Ut, commodi consectetur debitis quaerat nostrum reprehenderit incidunt iure veniam pariatur, hic obcaecati veritatis quidem? Ipsum beatae neque pariatur obcaecati inventore suscipit sunt dolorum exercitationem reiciendis laudantium.</h2>
     </div>
   </main>
  );
}
