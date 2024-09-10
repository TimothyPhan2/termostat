"use client";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, ArrowUpDown } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import BackButton from "./BackButton";

type LeaderboardEntry = {
  user_id: string;
  score: number;
  games_won: number;
  name: string;
  profile_pic: string;
};

const ITEMS_PER_PAGE = 10;

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-400" />;
    case 2:
      return <Medal className="h-4 w-4 sm:h-6 sm:w-6 text-gray-400" />;
    case 3:
      return <Award className="h-4 w-4 sm:h-6 sm:w-6 text-amber-600" />;
    default:
      return null;
  }
};

export default function LeaderboardComponent() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<"score" | "games_won">("score");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchLBData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/getLeaderBoard?t=${Date.now()}`, {
          method: "GET",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        const data = await res.json();
        
        setLeaderboardData(data.rows);
      } catch (error) {
        console.error("Error fetching leaderboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLBData();
  }, [pathname, searchParams]);
  const sortedPlayers = [...leaderboardData].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] - b[sortField];
    } else {
      return b[sortField] - a[sortField];
    }
  });

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentPlayers = sortedPlayers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(leaderboardData.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (field: "score" | "games_won") => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <>
      <div className="relative">
        <BackButton className="absolute top-4 left-4" />
      </div>
    <div className="container mx-auto  p-2 sm:p-4 min-h-screen flex flex-col">
      <Card className="flex-grow flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center">
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent" />
          </div>
          ) : (
            <>
              <div className="overflow-x-auto flex-grow">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px] sm:w-[100px]">
                        Rank
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("score")}
                          className="flex items-center justify-end w-full text-xs sm:text-sm"
                        >
                          Score
                          <ArrowUpDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("games_won")}
                          className="flex items-center justify-end w-full text-xs sm:text-sm"
                        >
                          Games Won
                          <ArrowUpDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentPlayers.map((player, index) => {
                      const globalRank =
                        sortedPlayers.findIndex(
                          (p) => p.user_id === player.user_id
                        ) + 1;
                      return (
                        <TableRow
                          key={player.user_id}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-medium p-">
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <span className="text-xs sm:text-sm">
                                {globalRank}
                              </span>
                              {getRankIcon(globalRank)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                                <AvatarImage
                                  src={player.profile_pic}
                                  alt={player.name}
                                />
                                <AvatarFallback>
                                  {player.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs sm:text-sm">
                                {player.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-xs sm:text-sm">
                            {player.score.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-xs sm:text-sm">
                            {player.games_won}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          handlePageChange(Math.max(1, currentPage - 1))
                        }
                        className={`${
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        } text-xs sm:text-sm`}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem
                        key={i}
                        className="hidden sm:inline-block"
                      >
                        <PaginationLink
                          onClick={() => handlePageChange(i + 1)}
                          isActive={currentPage === i + 1}
                          className="text-xs sm:text-sm"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem className="sm:hidden">
                      <PaginationLink className="text-xs sm:text-sm">
                        {currentPage} / {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          handlePageChange(
                            Math.min(totalPages, currentPage + 1)
                          )
                        }
                        className={`${
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        } text-xs sm:text-sm`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
}
