
import Foundation

class RunTestsRule : Rule {

    override func invokeWithModifiedFiles(files: [LRProjectFile], result: LROperationResult, completionHandler: dispatch_block_t) {
        if !effectiveVersion {
            result.completedWithInvocationError(missingEffectiveVersionError)
            completionHandler()
            return
        }

        let run = LRTRRun()
        let parser = LRTRTestAnythingProtocolParser()
        parser.delegate = run

        let step = ScriptInvocationStep()
        step.result = result
        configureStep(step)

        step.completionHandler = { step in
            parser.finish()
            NSLog("Tests = %@", run.tests)
            completionHandler()
        }

        step.outputLineBlock = { line in
            NSLog("Testing output line: %@", line.stringByTrimmingCharactersInSet(NSCharacterSet.newlineCharacterSet()))
            parser.processLine(line)
        }

        NSLog("%@: %@", label, project.rootURL.path)
        step.invoke()
    }

    override func targetForModifiedFiles(files: [LRProjectFile]) -> LRTarget? {
        if inputPathSpecMatchesFiles(files) {
            return LRProjectTarget(rule: self, modifiedFiles: files as [LRProjectFile])
        } else {
            return nil
        }
    }
    
}
