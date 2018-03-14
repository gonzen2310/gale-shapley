/* This is a the console executable, that makes use of BullCow class
   This acts as the view in a MVC pattern, and is responsible for all
   user interaction. For game logic see the FBullCowGame class
*/

#pragma once

#include <iostream>
#include <string>
#include "FBullCowGameh.h"

// make syntax unreal friendly
using FText = std::string;
using int32 = int;

// function prototypes
void PrintIntro();
void PlayGame();
FText GetValidGuess();
bool AskToPlayAgain();
void PrintGameSummary();

FBullCowGame BCGame; // instantiate a new game 

// Entry point for our application
int main()
{
	// introduce the game
	bool ask(false);
	do
	{
		PrintIntro();
		PlayGame();
		ask = AskToPlayAgain();
	} while (ask);

	return 0;
}

void PrintIntro() 
{
	int32 ChoosenLength(0);
	std::cout << "\n\nWelcome to Bulls and Cows, a fun word game\n" << std::endl;
	std::cout << "          }   {          ___               " << std::endl;
	std::cout << "          (o o)         (o o)              " << std::endl;
	std::cout << "   /-------\\/            \\ /-------\\    " << std::endl;
	std::cout << "  / | BULL |O             o| COW  | \\     " << std::endl;
	std::cout << " *  |-,----|               |------|  *     " << std::endl;
	std::cout << "    ^      ^               ^      ^        " << std::endl;
	std::cout << "Can you guess the " << BCGame.GetHiddenWordLength()<< " letter isogram I'm thinking of?\n" << std::endl;
	return;
}

// Loop continually until the user inputs a valid guess
FText GetValidGuess()
{
	FText Guess("");
	EGuessStatus Status(EGuessStatus::Invalid_Status);
	do
	{
		// get a guess from the player

		int32 CurrTry = BCGame.GetCurrentTry();
		std::cout << "Try " << CurrTry << " of " << BCGame.GetMaxTries() << ". Enter your guess: ";
		
		std::getline(std::cin, Guess);

		Status = BCGame.CheckGuessValidity(Guess);

		switch (Status)
		{
		case EGuessStatus::Not_Isogram:
			std::cout << "Word must be an isogram (i.e. No repeated letters) \n\n";
			break;
		case EGuessStatus::Wrong_Length:
			std::cout << "Please enter a " << BCGame.GetHiddenWordLength() << " letter word \n\n";
			break;
		case EGuessStatus::Not_Lowercase:
			std::cout << "Please enter all lowercase letters. \n\n";
			break;
		default:
			break;
		}
	} while (Status != EGuessStatus::Ok); // keep looping until we get no errors
	return Guess;

}

// Plays a single game to complition
void PlayGame()
{
	BCGame.Reset();
	int32 MaxTries = BCGame.GetMaxTries();

	// loop asking for guess while game is NOT won
	// and there are still tries reamining
	while (!BCGame.IsGameWon() && BCGame.GetCurrentTry() <= MaxTries)
	{
		FText Guess = GetValidGuess();
		// valid guess to the game and receive counts
		FBullCowCount BullCowCount = BCGame.SubmitValidGuess(Guess);

		std::cout << "Bulls = " << BullCowCount.Bulls;
		std::cout << ". Cows = " << BullCowCount.Cows << "\n\n";

	}
	PrintGameSummary();
	return;

}

bool AskToPlayAgain()
{
	std::cout << "Do you want to play again (y/n)? ";
	FText Response("");
	std::getline(std::cin, Response);
	return (Response[0] == 'y') || (Response[0] == 'Y');
}

void PrintGameSummary() 
{
	if (BCGame.IsGameWon())
	{
		std::cout << "WELL DONE -  YOU WIN!\n";
	}
	else
	{
		std::cout << "Better luck next time\n";
	}
}
