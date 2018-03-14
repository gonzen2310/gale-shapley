/*
 * Game logic (no view code or direct user interaction)
 */

#pragma once
#include <string>

// Make syntax Unreal friendly
using FString = std::string;
using int32 = int;

struct FBullCowCount
{
	int32 Bulls = 0;
	int32 Cows = 0;
};

enum class EGuessStatus
{
	Invalid_Status,
	Ok,
	Not_Isogram,
	Wrong_Length,
	Not_Lowercase
};

class FBullCowGame
{
public:
	FBullCowGame(); // constructor
	int32 GetMaxTries() const; 
	int32 GetCurrentTry() const;
	int32 GetHiddenWordLength() const;

	bool IsGameWon() const;
	EGuessStatus CheckGuessValidity(FString) const;

	void Reset(); 
	FBullCowCount SubmitValidGuess(FString); 	// counts bulls and cows and increases try # assuming valid guess



// Please and try and ignore this and focus on the interface above
private:
	// Initialized with constructor
	int32 MyCurrentTry;
	FString MyHiddenWord;
	bool bGameIsWon;

	bool IsIsogram(FString) const;
	bool IsLowercase(FString) const;

};