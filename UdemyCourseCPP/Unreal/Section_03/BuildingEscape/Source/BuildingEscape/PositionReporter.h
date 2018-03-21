// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "PositionReporter.generated.h"


UCLASS( ClassGroup=(Custom), meta=(BlueprintSpawnableComponent) ) // Tells the Unreal HeaderTool how to work with this class
class BUILDINGESCAPE_API UPositionReporter : public UActorComponent // UPositionReporter inherits from UActorComponent
{
	GENERATED_BODY()

public:	
	// Sets default values for this component's properties
	UPositionReporter(); // Constructor

protected:
	// Called when the game starts
	virtual void BeginPlay() override;
	// Virtual: we are not actually saying how it works here

public:	
	// Called every frame
	virtual void TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction) override;

		
	
};
