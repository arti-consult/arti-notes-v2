"use client";

import { useState } from "react";
import CustomerTable from "@/components/customer-table";
import CustomerKanban from "@/components/customer-kanban";
import CustomerPieChart from "@/components/customer-pie-chart";
import CustomerFilters from "@/components/customer-filters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { customers as allCustomers } from "@/data/customers";
import { Search, Table, Kanban, PieChart } from "lucide-react";
import {
  CustomerStatus,
  SubscriptionType,
  CustomerRole,
} from "@/types/customer";

export default function CustomersPage() {
  // Фильтры
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | null>(null);
  const [roleFilter, setRoleFilter] = useState<CustomerRole | null>(null);
  const [subscriptionFilter, setSubscriptionFilter] =
    useState<SubscriptionType | null>(null);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [dateSort, setDateSort] = useState<"none" | "recent" | "oldest">(
    "none"
  );
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"table" | "kanban" | "charts">("table");

  // Фильтрация и поиск
  const filteredCustomers = allCustomers.filter((customer) => {
    const matchesStatus = !statusFilter || customer.status === statusFilter;
    const matchesRole = !roleFilter || customer.role === roleFilter;
    const matchesSubscription =
      !subscriptionFilter || customer.subscription === subscriptionFilter;
    const matchesDate =
      !dateFilter ||
      (customer.createdAt &&
        new Date(customer.createdAt).toDateString() ===
          dateFilter.toDateString());
    const matchesSearch =
      !search ||
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      (customer.company &&
        customer.company.toLowerCase().includes(search.toLowerCase()));
    return (
      matchesStatus &&
      matchesRole &&
      matchesSubscription &&
      matchesDate &&
      matchesSearch
    );
  });

  const initials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("");

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Customers</h1>
        <div className="flex flex-col md:flex-row gap-2 md:items-center w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Input
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex gap-1 ml-0 md:ml-2">
            <Button
              variant={view === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("table")}
              aria-label="Table view"
            >
              <Table className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "kanban" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("kanban")}
              aria-label="Kanban view"
            >
              <Kanban className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "charts" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("charts")}
              aria-label="Charts view"
            >
              <PieChart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="mb-6">
        <CustomerFilters
          statusFilter={statusFilter}
          roleFilter={roleFilter}
          subscriptionFilter={subscriptionFilter}
          dateFilter={dateFilter}
          dateSort={dateSort}
          onStatusFilterChange={setStatusFilter}
          onRoleFilterChange={setRoleFilter}
          onSubscriptionFilterChange={setSubscriptionFilter}
          onDateFilterChange={setDateFilter}
          onDateSortChange={setDateSort}
        />
      </div>

      {/* Контент */}
      {view === "table" && <CustomerTable customers={filteredCustomers} />}
      {view === "kanban" && <CustomerKanban customers={filteredCustomers} />}
      {view === "charts" && <CustomerPieChart customers={filteredCustomers} />}
    </div>
  );
}
