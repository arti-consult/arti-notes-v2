import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Customer Flow Charm",
  description: "Learn more about Customer Flow Charm",
};

export function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">About Customer Flow Charm</h1>
      <div className="prose max-w-none">
        <p>
          Customer Flow Charm is a powerful customer relationship management
          system designed to help businesses streamline their customer
          interactions and improve their overall customer experience.
        </p>
        <p>
          Our platform provides a comprehensive suite of tools for managing
          customer relationships, automating workflows, and analyzing customer
          data to make informed business decisions.
        </p>
      </div>
    </div>
  );
}
